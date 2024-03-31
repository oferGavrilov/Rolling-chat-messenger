import { useRef, useState } from 'react';
import useStore from '../../context/store/useStore'
import useImageEditor from '../../custom-hook/useImageEditor';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function SelectedImage(): JSX.Element {
    const { selectedImage, gallery, setGallery } = useStore()
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [enableDrawing, setEnableDrawing] = useState<boolean>(false);


    const { setIsDrawing, toggleMirror, toggleFlip, grayscale, setGrayscale, addText, updateText, editableTextId, setEditableTextId } = useImageEditor({ ref: canvasRef, initialImage: selectedImage?.url as string });

    const toggleDrawingMode = () => {
        const newDrawingState = !enableDrawing;
        setEnableDrawing(newDrawingState);
        setIsDrawing(newDrawingState)
    };

    const onSave = () => {
        const canvas = canvasRef.current
        if (!canvas) return console.error('Canvas not found')

        canvas.toBlob(async (blob) => {
            if (!blob) return console.error('Blob not found')
            const newImageUrl = await uploadToCloudinary(blob)
            if (!newImageUrl) return console.error('Image not uploaded')

            updateGalleryWithNewImage(newImageUrl)
        }, 'image/png')
    }

    const updateGalleryWithNewImage = (newImageUrl: string): void => {
        if (!selectedImage) return console.error('No image selected')
        const newGallery = gallery.map(image => image._id === selectedImage._id ? { ...image, url: newImageUrl } : image)
        setGallery(newGallery)
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (editableTextId !== null) {
            updateText(editableTextId, event.target.value);
        }
    };

    if (!selectedImage) return <div>No image selected</div>

    return (
        <div className='flex-1'>
            <div className='w-full py-4 bg-dark-primary-bg flex justify-between text-white'>
                <div className='flex gap-x-4'>

                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={toggleDrawingMode}>
                        {enableDrawing ? "edit_off" : "brush"}
                    </button>
                    {/* <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={zoomIn}>zoom_in</button>
                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={zoomOut}>zoom_out</button>
                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={resetZoom}>search_off</button> */}
                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={toggleMirror} title='Mirror'>360</button>
                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={toggleFlip} title='Flip'>switch_access_shortcut</button>
                    <div>
                        GrayScale
                        <input type='range' min={0} max={100} value={grayscale} onChange={(e) => setGrayscale(+e.target.value)} />
                    </div>
                    <button className='material-symbols-outlined text-slate-300 hover:text-slate-50' onClick={addText}>title</button>

                </div>
                <button className='text-white' onClick={onSave}>
                    Save
                </button>
            </div>
            <div className='mt-16'>
                <div className='w-max mx-auto outline-dashed outline-primary outline-2 outline-offset-8'>
                    <canvas ref={canvasRef}></canvas>
                </div>
                {editableTextId !== null && (
                    <input
                        type="text"
                        onChange={handleTextChange}
                        onBlur={() => setEditableTextId(null)}
                        autoFocus
                    />
                )}
            </div>
        </div>
    )
}

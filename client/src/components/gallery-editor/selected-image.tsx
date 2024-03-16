import { useEffect, useRef, useState } from 'react'
import useStore from '../../context/store/useStore'
import { uploadToCloudinary } from '../../utils/cloudinary'

export default function SelectedImage(): JSX.Element {
    const { selectedImage, gallery, setGallery } = useStore()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [enableDrawing, setEnableDrawing] = useState<boolean>(false)
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    useEffect(() => {
        if (!selectedImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return console.error('Canvas context not found');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage.url + `?v=${new Date().getTime()}`; // Cache busting for re-render
        img.onload = () => {
            const maxWidth = canvas.parentElement?.offsetWidth ?? window.innerWidth;
            const maxHeight = window.innerHeight;
            const scale = Math.min(maxWidth / img.width, maxHeight / img.height) * zoomLevel;

            const width = img.width * scale;
            const height = img.height * scale;

            canvas.width = width;
            canvas.height = height;

            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
        };
    }, [selectedImage, zoomLevel]);

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let drawing = false

        const startDrawing = (event: MouseEvent) => {
            if (!enableDrawing) return
            drawing = true
            ctx.beginPath()
            ctx.moveTo(event.offsetX, event.offsetY)
        }

        const draw = (event: MouseEvent) => {
            if (!drawing) return
            ctx.lineTo(event.offsetX, event.offsetY)
            ctx.stroke()
        }

        const stopDrawing = () => {
            if (!drawing) return
            drawing = false
            ctx.closePath()
        }

        if (enableDrawing) {
            canvas.addEventListener('mousedown', startDrawing)
            canvas.addEventListener('mousemove', draw)
            canvas.addEventListener('mouseup', stopDrawing)
            canvas.addEventListener('mouseout', stopDrawing)
        } else {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', stopDrawing)
            canvas.removeEventListener('mouseout', stopDrawing)
        }

        return () => {
            canvas.removeEventListener('mousedown', startDrawing)
            canvas.removeEventListener('mousemove', draw)
            canvas.removeEventListener('mouseup', stopDrawing)
            canvas.removeEventListener('mouseout', stopDrawing)
        }
    }, [enableDrawing])


    const toggleDrawingMode = () => {
        setEnableDrawing(!enableDrawing)
    }

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

    const updateGalleryWithNewImage = (newImageUrl: string) => {
        if (!selectedImage) return console.error('No image selected')
        const newGallery = gallery.map(image => image._id === selectedImage._id ? { ...image, url: newImageUrl } : image)
        setGallery(newGallery)
    }

    const zoomIn = () => {
        setZoomLevel(prevZoom => Math.min(prevZoom * 1.1, 10)); // Optionally, set a max zoom level
    };

    const zoomOut = () => {
        setZoomLevel(prevZoom => Math.max(prevZoom * 0.9, 0.1)); // Optionally, set a min zoom level
    };


    if (!selectedImage) return <div>No image selected</div>

    return (
        <div className='flex-1'>
            <div className='w-full py-4 bg-dark-primary-bg flex justify-between text-white'>
                <div className='flex gap-x-4'>
                    <button className='' onClick={toggleDrawingMode}>
                        {enableDrawing ? "Stop Drawing" : "Start Drawing"}
                    </button>

                    <button onClick={zoomIn}>Zoom In</button>
                    <button onClick={zoomOut}>Zoom Out</button>
                </div>
                <button className='text-white' onClick={onSave}>
                    Save
                </button>
            </div>
            <div className='mt-16'>
                <div className='w-max mx-auto outline-dashed outline-primary outline-2 outline-offset-8'>
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    )
}

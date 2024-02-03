import { useEffect, useRef, useState } from 'react';
import useStore from '../../context/store/useStore';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function SelectedImage(): JSX.Element {
    const { selectedImage, gallery, setGallery } = useStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [isDrawing, setIsDrawing] = useState(false);
    const [enableDrawing, setEnableDrawing] = useState(false);

    useEffect(() => {
        if (!selectedImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return console.error('Canvas context not found');

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = selectedImage.url; // Ensure selectedImage is a string URL
        img.onload = () => {
            const maxWidth = canvas.parentElement?.offsetWidth ?? window.innerWidth;
            const maxHeight = window.innerHeight;

            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = img.width * ratio;
            const height = img.height * ratio;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);
        };
    }, [selectedImage]);

    // Setup drawing functionality
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let drawing = false;

        const startDrawing = (event: MouseEvent) => {
            if (!enableDrawing) return;
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(event.offsetX, event.offsetY);
        };

        const draw = (event: MouseEvent) => {
            if (!drawing) return;
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        };

        const stopDrawing = () => {
            if (!drawing) return;
            drawing = false;
            ctx.closePath();
        };

        if (enableDrawing) {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
        } else {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        }

        // Cleanup
        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseout', stopDrawing);
        };
    }, [enableDrawing]);


    const toggleDrawingMode = () => {
        setEnableDrawing(!enableDrawing);
    };

    // update the 
    const onSave = () => {
        const canvas = canvasRef.current;
        if (!canvas) return console.error('Canvas not found');

        canvas.toBlob(async (blob) => {
            if (!blob) return console.error('Blob not found');
            const newImageUrl = await uploadToCloudinary(blob);
            if (!newImageUrl) return console.error('Image not uploaded');

            updateGalleryWithNewImage(newImageUrl);
        }, 'image/png');
    };

    const updateGalleryWithNewImage = (newImageUrl: string) => {
        if (!selectedImage) return console.error('No image selected');
        const newGallery = gallery.map(image => image._id === selectedImage._id ? {...image, url: newImageUrl} : image);
        setGallery(newGallery);
        // setGallery(gallery => gallery.map(image => image.id === selectedImageId ? {...image, url: newImageUrl} : image));

    };

    if (!selectedImage) return <div>No image selected</div>;

    return (
        <div className='flex-1'>
            <div className='w-full py-4 bg-blue-500 flex justify-between'>
                <button className='text-white' onClick={toggleDrawingMode}>
                    {enableDrawing ? "Stop Drawing" : "Start Drawing"}
                </button>
                <button className='text-white' onClick={onSave}>
                    Save
                </button>
            </div>
            <div className='mt-16'>
                <div className='w-2/3 mx-auto'>
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
}

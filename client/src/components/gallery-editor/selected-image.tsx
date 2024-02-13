import { useEffect, useRef, useState } from 'react'
import useStore from '../../context/store/useStore'
import { uploadToCloudinary } from '../../utils/cloudinary'

export default function SelectedImage(): JSX.Element {
    const { selectedImage, gallery, setGallery } = useStore()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [enableDrawing, setEnableDrawing] = useState<boolean>(false)

    useEffect(() => {
        if (!selectedImage || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return console.error('Canvas context not found')

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = selectedImage.url
        img.onload = () => {
            const maxWidth = canvas.parentElement?.offsetWidth ?? window.innerWidth
            const maxHeight = window.innerHeight

            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height)
            const width = img.width * ratio
            const height = img.height * ratio

            canvas.width = width
            canvas.height = height

            ctx.drawImage(img, 0, 0, width, height)
        }
    }, [selectedImage])

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

    // update the 
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


    if (!selectedImage) return <div>No image selected</div>

    return (
        <div className='flex-1'>
            <div className='w-full py-4 bg-blue-500 flex justify-between text-white'>
                <div className='flex gap-x-4'>
                    <button className='' onClick={toggleDrawingMode}>
                        {enableDrawing ? "Stop Drawing" : "Start Drawing"}
                    </button>

                    <button className=''>
                        Zoom In
                    </button>

                    <button className=''>
                        Zoom Out
                    </button>
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

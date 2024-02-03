import { useEffect, useState } from "react"

import { toast } from "react-toastify"
import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"
import { IGallery } from "../../../model/gallery"
import { galleryService } from "../../../services/gallery.service"


export default function Gallery(): JSX.Element {
    const { selectedImage, setSelectedImage, gallery, setGallery } = useStore()
    const { user } = AuthState()

    const [imageLoading, setImageLoading] = useState<boolean>(false)

    useEffect(() => {
        loadGallery()
    }, [])

    async function loadGallery() {
        if (!user) return
        const gallery = await galleryService.getGallery()
        setGallery(gallery)
    }

    async function uploadImage(file: File | undefined) {
        if (!user || !file) return toast.warn('Upload image went wrong')

        const formData = new FormData()

        formData.append('image', file)
        formData.append('title', 'New Image')
        try {
            setImageLoading(true)
            const response: IGallery = await galleryService.createGallery(formData)

            console.log(response)
            if (response && response._id) { 
                setGallery(prevGallery => [...prevGallery, response])
                toast.success('Image uploaded successfully!')
            } else {
                toast.error('Unexpected response from server.')
            }
        } catch (err) {
            console.log(err)
        }
    }


    function onSelectImage(item: IGallery) {
        console.log(item, user?._id)
        if (!user) return
        const itemToSet = {
            ...item,
            userId: user._id
        }
        setSelectedImage(itemToSet)
    }

    return (
        <div>
            <h1>Gallery</h1>
            {/* <button onClick={onNewImage}>New Image</button> */}
            {imageLoading}
            <label className="cursor-pointer flex items-center justify-center rounded-full p-3 w-max backdrop-blur-sm bg-gray-300/20 hover:text-primary">
                <span className="material-symbols-outlined">add</span>
                <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/*' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    uploadImage(e.target.files?.[0])
                } />
            </label>
            <div className="grid grid-cols-2 gap-2 m-4">
                {gallery.map((item) => (
                    <div key={item._id} className={`gallery-item ${selectedImage?._id === item._id && 'border-2 border-primary opacity-80'}`} onClick={() => onSelectImage(item)}>
                        <img src={item.url} alt={item.title} className="object-cover aspect-square" />
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

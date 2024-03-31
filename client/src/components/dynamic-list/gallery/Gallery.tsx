import { useEffect, useState } from "react"

import useStore from "../../../context/store/useStore"
import { AuthState } from "../../../context/useAuth"
import { IGallery } from "../../../model/gallery"
import { galleryService } from "../../../services/gallery.service"
import UploadGalleryImage from "./UploadGalleryImage"
import { toast } from "react-toastify"
import EditGallery from "./EditGallery"


export default function Gallery(): JSX.Element {
    const { selectedImage, setSelectedImage, setSelectedChat, gallery, setGallery } = useStore()
    const { user } = AuthState()

    const [viewMode, setViewMode] = useState<'upload' | 'list' | 'edit'>('list')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        loadGallery()
    }, [])

    async function loadGallery(): Promise<void> {
        if (!user) return
        setIsLoading(true)
        try {
            const gallery = await galleryService.getGallery()
            setGallery(gallery)

        } catch (error) {
            console.error("Error loading gallery:", error);
            toast.error('An error occurred while loading the gallery.');
        } finally {
            setIsLoading(false);
        }
    }

    function onSelectImage(item: IGallery): void {
        if (!user) return

        setSelectedChat(null)
        setSelectedImage(item)
    }

    async function onRemoveItem(ev: React.MouseEvent<HTMLDivElement>, item: IGallery): Promise<void> {
        ev.stopPropagation()

        if (!user) return
        const confirm = window.confirm('Are you sure you want to delete this image?')
        if (!confirm) return

        setIsLoading(true)
        try {
            const result = await galleryService.deleteGalleryItem(item._id);
            console.log(result)
            if (result) {
                const newGallery = gallery.filter((img) => img._id !== item._id);
                setGallery(newGallery);
                setSelectedImage(null);
                toast.success('Image deleted successfully.');
            } else {
                toast.error('Failed to delete the image. Please try again.');
            }
        } catch (error) {
            console.error("Error deleting the image:", error);
            toast.error('An error occurred while deleting the image.');
        } finally {
            setIsLoading(false);
        }
    }

    const onSetViewMode = () => {
        if (viewMode === 'edit') {
            setViewMode('list')
        } else if (viewMode === 'upload') {
            setViewMode('list')
        } else {
            setViewMode('upload')
        }
    }

    return (
        <div>
            {!isLoading && <div onClick={() => onSetViewMode()} className="cursor-pointer ml-auto text-sm mr-4 flex items-center justify-center rounded-xl px-3 py-2 w-max bg-gray-300/20 hover:text-primary">
                {viewMode !== 'list' ? 'Back To Gallery' : 'Add New Image'}
            </div>}

            {viewMode === 'list' &&
                (
                    <div className='grid grid-cols-2 gap-2 mx-4 my-6'>
                        {gallery.map((item) => (
                            <div key={item._id} className={`gallery-item ${selectedImage?._id === item._id && 'outline-2 outline outline-offset-2 outline-primary opacity-80'} ${isLoading && 'opacity-45 pointer-events-none animate-pulse'}`} onClick={() => onSelectImage(item)}>
                                <img src={item.url} alt={item.title} className="object-cover aspect-square" />
                                <p className="text-center absolute bottom-0 w-full text-xs uppercase">{item.title}</p>

                                <div className="gallery-float-btns">
                                    <div className="float-btn bg-red-500 " onClick={(ev) => onRemoveItem(ev, item)}>
                                        <span className="material-symbols-outlined text-xl">delete</span>
                                    </div>
                                    <div className="float-btn bg-primary" onClick={() => setViewMode('edit')}>
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && <div className="spinner absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !w-32 !h-32 after:!w-32 after:!h-32" />}
                    </div>
                )}

            {viewMode === 'upload' &&
                (
                    <UploadGalleryImage setViewMode={setViewMode} />
                )}

            {viewMode === 'edit' &&
                (
                    <EditGallery />
                )}

        </div>
    )
}

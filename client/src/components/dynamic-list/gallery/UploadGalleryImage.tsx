import React, { useState } from "react";
import { toast } from "react-toastify";
import { galleryService } from "../../../services/gallery.service";
import { IGallery } from "../../../model/gallery";
import { AuthState } from "../../../context/useAuth";
import useStore from "../../../context/store/useStore";

interface Props {
    setIsShowUploadForm: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UploadGalleryImage({ setIsShowUploadForm }: Props): JSX.Element {
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("New Image")
    const [dragOver, setDragOver] = useState<boolean>(false);

    const { user } = AuthState();
    const { setGallery } = useStore();

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            uploadImage(file);
        }
    };

    async function uploadImage(file: File): Promise<void> {
        if (!user) return

        if (!file) {
            toast.error('No file selected.');
            return
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please select a PNG, JPEG, or WEBP image.');
            return;
        }

        // max 2MB
        if (file.size > 2 * 1024 * 1024) {
            toast.error('File size must be less than 2MB.');
            return;
        }

        if (!title) {
            toast.error('Please enter a title for the image.');
            return
        }

        if (title.length > 30) {
            toast.error('Title must be 30 characters or less.');
            return
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);

        try {
            setImageLoading(true);
            const newImage: IGallery = await galleryService.createGallery(formData);

            if (newImage && newImage._id) {
                setGallery((prevGallery) => [...prevGallery, newImage]);
                toast.success('Image uploaded successfully!');
                setIsShowUploadForm(false);
            } else {
                toast.error('Failed to upload image. Please try again.');
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred during upload. Please try again.');
        } finally {
            setImageLoading(false);
        }
    }

    return (
        <div className="p-8">
            <input
                type="text"
                placeholder="Image Title"
                className="w-full rounded-xl px-4 py-2 mb-4 bg-gray-300/20"
                maxLength={30}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div
                className={`relative border-2 border-dashed p-8 ${dragOver ? 'border-primary' : 'border-gray-300'} ${imageLoading && 'opacity-70 cursor-not-allowed pointer-events-none'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
            >
                {!imageLoading ? (
                    <p className="text-center">Drag and drop an image here, or click to select a file.</p>
                ) : (
                    <div className="spinner flex mx-auto" />
                )}

                <input
                    type="file"
                    name="image"
                    className="opacity-0 w-full h-full absolute"
                    accept="image/*"
                    onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
                    style={{ top: 0, left: 0, cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}

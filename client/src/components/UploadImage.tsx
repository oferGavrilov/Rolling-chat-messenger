import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface Props {
      image: string | File
      handleImageChange: (image: File) => void | Promise<void>
}

export default function UploadImage({ image, handleImageChange }: Props) {
      const [imageLoading, setImageLoading] = useState<boolean>(false)
      const [imageUrl, setImageUrl] = useState<string | undefined>();

      useEffect(() => {
            if (image instanceof File) {
                  const url = URL.createObjectURL(image);
                  setImageUrl(url);

                  // Cleanup the object URL on component unmount
                  return () => URL.revokeObjectURL(url);
            } else {
                  setImageUrl(image);
            }
      }, [image]);

      async function uploadImage(file: File | undefined) {
            if (!file) return toast.warn('No file selected')

            try {
                  setImageLoading(true)
                  await handleImageChange(file)

            } catch (err) {
                  console.log(err)
            } finally {
                  setImageLoading(false)
            }
      }

      return (
            <label
                  htmlFor="img-upload"
                  className='upload-img fade-grow-up bg-center'
                  style={{ backgroundImage: `url(${imageUrl ? imageUrl : 'imgs/guest.jpg'})`, backgroundSize: 'cover' }}
            >
                  {imageLoading ? (
                        <div className='spinner'></div>
                  ) : (
                        <div className='overlay hidden '>
                              <div className={`flex flex-col items-center text-sm ${image && 'text-primary'}`}>
                                    <span className="material-symbols-outlined text-3xl font-bold">photo_camera</span>
                                    Change Image
                              </div>
                        </div>
                  )}

                  <input
                        type="file"
                        name='image'
                        id='img-upload'
                        className='opacity-0 h-0 w-0'
                        accept='image/*'
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => uploadImage(e.target.files?.[0])} />
            </label>
      )
}

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { uploadImg } from '../utils/cloudinary'

interface Props {
      image: string
      // setImage: CallableFunction
      setImage: (image: string, TN_Image: string) => void
      editImage?: (updateType: 'image' | 'name', updateData: string) => Promise<void>
}

export default function UploadImage({ image, setImage, editImage }: Props) {
      const [imageLoading, setImageLoading] = useState<boolean>(false)

      const uploadResizedImage = async (file: File, originalFileName: string): Promise<string> => {
            const canvasToBlob = async (canvas: HTMLCanvasElement, quality: number): Promise<Blob> => {
                  return new Promise((resolve, reject) => {
                        canvas.toBlob(blob => {
                              if (blob) {
                                    resolve(blob);
                              } else {
                                    reject(new Error('Canvas to Blob conversion failed'));
                              }
                        }, 'image/jpeg', quality);
                  });
            };

            // Create an image element and load the file
            const img = new Image();
            img.src = URL.createObjectURL(file);
            await new Promise((resolve, reject) => {
                  img.onload = resolve;
                  img.onerror = reject;
            });

            // Create a canvas and draw the image onto it with new dimensions
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Couldn't get canvas context");

            // Calculate the resized dimensions
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                  if (width > MAX_WIDTH) {
                        height = height * (MAX_WIDTH / width);
                        width = MAX_WIDTH;
                  }
            } else {
                  if (height > MAX_HEIGHT) {
                        width = width * (MAX_HEIGHT / height);
                        height = MAX_HEIGHT;
                  }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert the canvas to a blob
            const blob = await canvasToBlob(canvas, 0.7);
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });

            // Upload the resized image file
            const resizedData = await uploadImg(resizedFile, true, originalFileName);
            return resizedData.url;
      };

      async function uploadImage(file: File | undefined) {
            if (!file) return toast.warn('Upload image went wrong')

            try {
                  setImageLoading(true)
                  const data = await uploadImg(file)
                  const originalFileName = data.public_id
                  const resizedImageUrl = await uploadResizedImage(file, originalFileName)

                  // setImage(data?.url || image)
                  setImage(data.url, resizedImageUrl)

                  if (editImage) editImage('image', data.url)
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
                  style={{ backgroundImage: `url(${image ? image : 'imgs/guest.jpg'})`, backgroundSize: 'cover' }}
            >
                  {imageLoading ? (
                        <div className='spinner'></div>) : (

                        <div className='overlay hidden '>
                              <div className={`flex flex-col items-center text-sm ${image && 'text-primary'}`}>
                                    <span className="material-symbols-outlined text-3xl font-bold">photo_camera</span>
                                    Change Image
                              </div>
                        </div>
                  )}

                  <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/*' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        uploadImage(e.target.files?.[0])
                  } />
            </label>
      )
}

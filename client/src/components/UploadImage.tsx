import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { uploadImg } from '../utils/cloudinary'
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded'

interface Props {
      image: string
      setImage: CallableFunction
      editImage?: CallableFunction
}

export default function UploadImage ({ image, setImage, editImage }: Props) {
      const [imageLoading, setImageLoading] = useState<boolean>(false)

      async function uploadImage (file: File | undefined) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  setImageLoading(true)
                  const data = await uploadImg(file)
                  setImage(data?.url || image)
                  if (editImage) editImage(data.url)
            } catch (err) {
                  console.log(err)
            } finally {
                  setImageLoading(false)
            }
      }
      return (
            <label
                  htmlFor="img-upload"
                  className='upload-img fade-grow-up'
                  style={{ backgroundImage: `url(${image ? image : 'imgs/guest.jpg'})`, backgroundSize: 'cover' }}
            >
                  {imageLoading ? (
                        <div className='spinner'></div>) : (

                        <div className='overlay hidden '>
                              <div className={`flex flex-col items-center text-sm ${image && 'text-white'}`}>
                                    <CameraAltRoundedIcon fontSize='large' />
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

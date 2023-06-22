import React from 'react'
import { toast } from 'react-toastify'
import { uploadImg } from '../utils/upload-img'

interface Props {
      image: string
      setImage: React.Dispatch<React.SetStateAction<string>>
      editImage?: CallableFunction
}

export default function UploadImage ({image , setImage , editImage}:Props) {
      const [imageLoading, setImageLoading] = React.useState<boolean>(false)

      async function uploadImage (file: File) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  setImageLoading(true)
                  const data = await uploadImg(file)
                  setImage(data.url)
                  editImage(data.url)
            } catch (err) {
                  console.log(err)
            } finally {
                  setImageLoading(false)
            }
      }
      return (
            <label
                  htmlFor="img-upload"
                  className='upload-img'
                  style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover' }}
            >{imageLoading && <div className='spinner'></div> || !image && 'Add Group Image'}
                  <div className='overlay hidden '> Upload Image</div>
                  <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/*' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        uploadImage(e.target.files?.[0])
                  } />
            </label>
      )
}

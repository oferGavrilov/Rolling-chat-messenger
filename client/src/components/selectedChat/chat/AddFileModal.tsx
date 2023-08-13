import React, { useRef, useState } from 'react'
import { Client } from 'filestack-js'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { toast } from 'react-toastify'
import { uploadImg } from '../../../utils/cloudinary'
import { useClickOutside } from '../../../custom/useClickOutside'

import PermMediaIcon from '@mui/icons-material/PermMedia'
import LocalSeeIcon from '@mui/icons-material/LocalSee'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import Camera from './Camera'

interface Props {
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
}

export default function AddFileModal ({ setFile, setChatMode }: Props) {
      const [showClipModal, setShowClipModal] = useState<boolean>(false)
      const [showCamera, setShowCamera] = useState<boolean>(false)

      const modalRef = useRef<HTMLUListElement>(null)

      useClickOutside(modalRef, () => setShowClipModal(false), showClipModal)

      const handleCapture = async (image: string) => {
            try {
                  const blob = await fetch(image).then((r) => r.blob())
                  const file = new File([blob], 'captured-image.jpeg', { type: 'image/jpeg' })

                  const cloudinaryResponse = await uploadImg(file)
                  if (!cloudinaryResponse || !cloudinaryResponse.url) {
                        return toast.error('Upload failed')
                  }

                  setFile(cloudinaryResponse.url)
                  setChatMode('send-file')
                  setShowCamera(false)
            } catch (err) {
                  console.log(err)
                  toast.error('Upload error')
            }
      }

      async function uploadImage (file: File | undefined) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  const response = await uploadImg(file)
                  if (!response || !response.url) {
                        return toast.error('Invalid response from Cloudinary')
                  }
                  console.log(response)

                  setFile(response.url)
                  setChatMode('send-file')
            } catch (err) {
                  console.log(err)
            }
      }

      async function handleFileUpload () {
            try {
                  const apiKey = 'AlByYY7HGT6Fwh5ghBpSZz'
                  const client = new Client(apiKey) 

                  const pickerOptions = {
                        accept: ['.pdf'],
                        maxFiles: 1,
                        fromSources: ['local_file_system', 'googledrive', 'dropbox', 'onedrive'],
                        onUploadDone: (result) => {
                              console.log(result)
                              if (result.filesUploaded && result.filesUploaded.length > 0) {
                                    const fileUrl = result.filesUploaded[0]
                                    setFile(fileUrl)
                                    setChatMode('send-file')
                              }
                        },
                  }

                  await client.picker(pickerOptions).open()

            } catch (error) {
                  console.error(error)
            }
      }


      return (
            <div className='relative'>
                  <AddRoundedIcon
                        onClick={() => setShowClipModal((prev) => !prev)}
                        className={`text-slate-500 dark:text-dark-primary-text !text-[2rem]  ml-2 md:ml-0 !transition-transform !duration-300 hover:text-gray-600 cursor-pointer
            ${showClipModal ? '-rotate-[135deg] bg-gray-200 dark:bg-dark-primary-bg rounded-full pointer-events-none' : ''} `} />

                  <ul
                        ref={modalRef}
                        className={`
                        fixed bottom-14 left-8 px-2 pb-3 text-white rounded-lg z-20 bg-gray-400 dark:bg-dark-primary-bg overflow-hidden
                        transition-all duration-300 ease-in-out max-w-[40px] !shadow-2xl
                        ${showClipModal ? 'max-h-[300px] max-w-full' : 'max-h-0 px-0 !py-0 '}`}>

                        <label className='clip-modal-option py-1 inline-flex '>
                              <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/gif, image/jpeg, image/png' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    uploadImage(e.target.files?.[0])
                              } />
                              <span className=''>
                                    <PermMediaIcon className='mr-2 text-primary shadow-lg' />
                                    Images and Videos
                              </span>
                        </label>
                        <li className='clip-modal-option my-2 py-1 flex items-center' onClick={() => setShowCamera(true)}>
                              <LocalSeeIcon className='mr-2 text-[#ff2e74]' />
                              Camera
                        </li>
                        <li className='clip-modal-option py-1 flex items-center' onClick={handleFileUpload}>
                              <TextSnippetIcon className='mr-2 text-purple-500' />
                              File
                        </li>
                  </ul>

                  {showCamera && (
                        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 z-30">
                              <button
                                    className="absolute top-4 right-4 text-white text-xl"
                                    onClick={() => setShowCamera(false)}
                              >
                                    Close
                              </button>
                              <Camera onCapture={handleCapture} />
                        </div>
                  )}
            </div>)
}

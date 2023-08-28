import React, { useRef, useState } from 'react'

import { Client } from 'filestack-js'
import { toast } from 'react-toastify'

import { uploadImg } from '../../../utils/cloudinary'
import { useClickOutside } from '../../../custom/useClickOutside'

import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import LocalSeeIcon from '@mui/icons-material/LocalSee'

import Camera from './Camera'
import { IFile } from '../../../model/chat.model'

interface Props {
      setFile: React.Dispatch<React.SetStateAction<IFile | null>>
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "send-file">>
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

                  setFile(response.url)
                  setChatMode('send-file')
            } catch (err) {
                  console.log(err)
            }
      }

      async function handleFileUpload () {
            const apiKey = import.meta.env.VITE_FILESTACK_API_KEY
            try {
                  const client = new Client(apiKey)

                  const pickerOptions = {
                        accept: ['.pdf'],
                        maxFiles: 1,
                        fromSources: ['local_file_system', 'googledrive', 'dropbox', 'onedrive'],
                        onUploadDone: (result) => {
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
                        className={`text-slate-500 dark:text-dark-primary-text !text-[2rem]  ml-2 md:ml-0 !transition-transform !duration-300 rounded-full hover:text-gray-600 dark:hover:bg-dark-tertiary-bg cursor-pointer
            ${showClipModal ? '-rotate-[135deg] bg-gray-200 dark:bg-dark-primary-bg rounded-full pointer-events-none' : ''} `} />

                  <ul
                        ref={modalRef}
                        className={`
                        fixed bottom-14 left-8 px-2 pb-3 text-white rounded-lg z-20 bg-gray-400 dark:bg-dark-primary-bg overflow-hidden
                        transition-all duration-300 ease-in-out !shadow-2xl
                        ${showClipModal ? 'max-h-[300px] py-2 w-[210px]' : 'max-h-0 !py-0 w-[40px]'}`}>

                        <label className='clip-modal-option whitespace-nowrap py-1 flex '>
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

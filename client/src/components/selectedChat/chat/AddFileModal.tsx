import React, { useRef, useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { toast } from 'react-toastify'
import { uploadImg } from '../../../utils/upload-img'
import { useClickOutside } from '../../../custom/useClickOutside'

import PermMediaIcon from '@mui/icons-material/PermMedia';
import LocalSeeIcon from '@mui/icons-material/LocalSee';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

interface Props {
      setFile: React.Dispatch<React.SetStateAction<File | null>>
      setChatMode: React.Dispatch<React.SetStateAction<string>>
}

export default function AddFileModal ({ setFile, setChatMode }: Props) {
      const [showClipModal, setShowClipModal] = useState<boolean>(false)

      const modalRef = useRef<HTMLUListElement>(null)

      useClickOutside(modalRef, () => setShowClipModal(false), showClipModal)

      async function uploadImage (file: File | undefined) {
            if (!file) return toast.error('Upload image went wrong')
            try {
                  const data = await uploadImg(file)
                  setFile(data?.url)
                  setChatMode('send-file')
            } catch (err) {
                  console.log(err)
            }
      }

      return (
            <div className='relative'>
                  <AddRoundedIcon
                        onClick={() => setShowClipModal((prev) => !prev)}
                        className={`text-slate-500 !text-[2rem] !transition-transform !duration-300 hover:text-gray-600 cursor-pointer
            ${showClipModal ? '-rotate-[135deg] bg-gray-200 rounded-full pointer-events-none' : ''} `} />

                  <ul
                        ref={modalRef}
                        className={`
            fixed bottom-14 left-8 px-2 pb-3 text-white rounded-lg z-20 bg-gray-400 overflow-hidden
             transition-all duration-300 ease-in-out
            ${showClipModal ? 'w-auto max-h-[300px] max-w-xs' : 'max-h-0 px-0 !py-0 max-w-[80px]'}`}>

                        <label className='clip-modal-option py-1 inline-flex '>
                              <input type="file" name='image' id='img-upload' className='opacity-0 h-0 w-0' accept='image/gif, image/jpeg, image/png' onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    uploadImage(e.target.files?.[0])
                              } />
                              <span className=''>
                                    <PermMediaIcon className='mr-2 text-primary shadow-lg' />
                                    Images and Videos
                              </span>
                        </label>
                        <li className='clip-modal-option my-2 py-1 flex items-center'>
                              <LocalSeeIcon className='mr-2 text-[#ff2e74]' />
                              Camera</li>
                        <li className='clip-modal-option py-1 flex items-center'>
                              <TextSnippetIcon className='mr-2 text-purple-500'/>
                              File</li>
                  </ul>
            </div>)
}

import { useState } from 'react'
import { toast } from 'react-toastify'

import UploadImage from '../../UploadImage'
import { AuthState } from '../../../context/useAuth'
import { userService } from '../../../services/user.service'
import { IUser } from '../../../model/user.model'

import { Tooltip } from '@mui/material'

interface UserValues {
      username: string | undefined
      about: string | undefined
}

export default function Profile(): JSX.Element {
      const { user, setUser } = AuthState()
      const [imageObj, setImageObj] = useState<{
            image: string | File, TN_Image: string | File
      }>({ image: user?.profileImg || '', TN_Image: '' })

      const [editType, setEditType] = useState<'username' | 'about' | ''>('')
      const [userValues, setUserValues] = useState<UserValues>({
            username: user?.username ?? '',
            about: user?.about ?? '',
      })

      async function handleEdit() {
            if (!editType || !user) return

            const newValue = userValues[editType as keyof UserValues] as string

            // Check for special symbols in the input value
            const specialSymbolsRegex = /[!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?]+/
            if (specialSymbolsRegex.test(newValue)) {
                  return toast.warn(`Please enter a valid ${editType} without special symbols`)
            }

            if (newValue === user?.[editType]) {
                  return toast.warn(`There is no change in ${editType}`)
            }

            if (newValue === user?.[editType] || newValue === '') {
                  return toast.warn(`Please enter a valid ${editType}`)
            }

            try {
                  const { newUserValue, field } = await userService.editUserDetails(newValue, editType)
                  const userToSave = { ...user, [field]: newUserValue } as IUser
                  setUser(userToSave)
                  setEditType('')
                  toast.success(`${field} changed successfully`)
            } catch (errMsg) {
                  if (errMsg && typeof errMsg === 'string') {
                        toast.error(errMsg as string)
                  }
            }
      }

      async function handleImageChange(image: File): Promise<void> {
            // setImageObj(prevState => ({ ...prevState, image }))

            try {
                  const { newProfileImg, newTN_profileImg } = await userService.updateUserImage(image)

                  const userToSave = {
                        ...user,
                        profileImg: newProfileImg,
                        TN_profileImg: newTN_profileImg
                  } as IUser

                  setImageObj({ image: newProfileImg, TN_Image: newTN_profileImg })
                  setUser(userToSave)

                  toast.success('Image changed successfully')
            } catch (errMsg) {
                  if (errMsg && typeof errMsg === 'string') {
                        toast.error(errMsg as string)
                  }
            }
      }

      return (
            <section>
                  <UploadImage image={imageObj.image} handleImageChange={handleImageChange} />

                  <div className='px-6 py-10'>
                        <span className='text-lg font-semibold text-primary dark:text-dark-tertiary-text'>Your Name</span>
                        <div className='flex items-center gap-x-2 py-5'>
                              {editType === 'username' ? (
                                    <>
                                          <span className="material-symbols-outlined text-primary cursor-pointer" onClick={handleEdit}>check</span>
                                          <input
                                                type="text"
                                                className='border-b-2 w-full px-2 bg-inherit border-primary'
                                                value={userValues.username}
                                                onChange={(e) => setUserValues({ ...userValues, username: e.target.value })}
                                          />
                                          <span className="material-symbols-outlined text-red-500 cursor-pointer" onClick={() => setEditType('')}>close</span>
                                    </>
                              ) : (
                                    <>
                                          <Tooltip title='Edit Name' placement='top' arrow>
                                                <span className="material-symbols-outlined text-xl leading-none mr-1 cursor-pointer" onClick={() => setEditType('username')}>edit</span>
                                          </Tooltip>
                                          <span className='text-gray-500 dark:text-dark-primary-text'>{user?.username}</span>
                                    </>
                              )}
                        </div>

                        <div className='py-10'>
                              <span className='text-lg font-semibold text-primary dark:text-dark-tertiary-text'>About</span>
                              <div className='flex items-center gap-x-2 py-5'>
                                    {editType === 'about' ? (
                                          <>
                                                <span className="material-symbols-outlined text-primary cursor-pointer" onClick={handleEdit}>check</span>
                                                <input
                                                      type="text"
                                                      className='border-b-2 w-full px-2 bg-inherit border-primary'
                                                      value={userValues.about}
                                                      onChange={(e) => setUserValues({ ...userValues, about: e.target.value })}
                                                />
                                                <span className="material-symbols-outlined text-red-500 cursor-pointer" onClick={() => setEditType('')}>close</span>
                                          </>
                                    ) : (
                                          <>
                                                <Tooltip title='Edit About' placement='top' arrow>
                                                      {/* <ModeEditOutlineIcon fontSize='small' className='cursor-pointer' onClick={() => setEditType('about')} /> */}
                                                      <span className="material-symbols-outlined text-xl leading-none mr-1 cursor-pointer" onClick={() => setEditType('about')}>edit</span>

                                                </Tooltip>
                                                <span className='text-gray-500 dark:text-dark-primary-text'>{user?.about}</span>
                                          </>
                                    )}
                              </div>
                        </div>
                  </div>
            </section>
      )
}

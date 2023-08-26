import { useState } from 'react'
import { toast } from 'react-toastify'

import UploadImage from '../UploadImage'
import { AuthState } from '../../context/useAuth'
import { userService } from '../../services/user.service'
import { IUser } from '../../model/user.model'

import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import { Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

interface UserValues {
      username: string | undefined
      about: string | undefined
}

export default function Profile (): JSX.Element {
      const { user, setUser } = AuthState()
      const [image, setImage] = useState<string>(user?.profileImg || '')
      const [editType, setEditType] = useState<'username' | 'about' | ''>('')
      const [userValues, setUserValues] = useState<UserValues>({
            username: user?.username ?? '',
            about: user?.about ?? '',
      })

      async function handleEdit () {
            if (!editType || !user) return;

            const newValue = userValues[editType as keyof UserValues] as string;

            // Check for special symbols in the input value
            const specialSymbolsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (specialSymbolsRegex.test(newValue)) {
                  return toast.error(`Please enter a valid ${editType} without special symbols`);
            }

            if (newValue === user?.[editType] || newValue === '') {
                  return toast.error(`Please enter a valid ${editType}`);
            }

            const newUser = await userService.editUserDetails(newValue, editType);
            setUser(newUser);
            setEditType('');
            toast.success(`${editType} changed successfully`);
      }

      async function handleImageChange (newImage: string): Promise<void> {
            setImage(newImage)
            const savedImage = await userService.updateUserImage(newImage)
            const userToSave = {
                  ...user,
                  profileImg: savedImage,
            } as IUser
            setUser(userToSave)
      }

      return (
            <section>
                  <UploadImage image={image} setImage={handleImageChange} />

                  <div className='px-6 py-10'>
                        <span className='text-lg font-semibold text-primary dark:text-dark-tertiary-text'>Your Name</span>
                        <div className='flex items-center gap-x-2 py-5'>
                              {editType === 'username' ? (
                                    <>
                                          <CheckIcon fontSize='small' className='text-primary cursor-pointer' onClick={handleEdit} />
                                          <input
                                                type="text"
                                                className='border-b-2 w-full px-2 bg-inherit border-primary'
                                                value={userValues.username}
                                                onChange={(e) => setUserValues({ ...userValues, username: e.target.value })}
                                          />

                                          <CloseIcon className='ml-2 !text-2xl text-red-500 cursor-pointer' onClick={() => setEditType('')} />
                                    </>
                              ) : (
                                    <>
                                          <Tooltip title='Edit Name' placement='top' arrow>
                                                <ModeEditOutlineIcon fontSize='small' className='cursor-pointer' onClick={() => setEditType('username')} />
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
                                                <CheckIcon fontSize='small' className='text-primary cursor-pointer' onClick={handleEdit} />
                                                <input
                                                      type="text"
                                                      className='border-b-2 w-full px-2 bg-inherit border-primary'
                                                      value={userValues.about}
                                                      onChange={(e) => setUserValues({ ...userValues, about: e.target.value })}
                                                />

                                                <CloseIcon className='ml-2 !text-2xl text-red-500 cursor-pointer' onClick={() => setEditType('')} />
                                          </>
                                    ) : (
                                          <>
                                                <Tooltip title='Edit About' placement='top' arrow>
                                                      <ModeEditOutlineIcon fontSize='small' className='cursor-pointer' onClick={() => setEditType('about')} />
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

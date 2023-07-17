import { useState } from 'react'
import UploadImage from './UploadImage'
import { AuthState } from '../context/useAuth'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';
import { toast } from 'react-toastify';
import { userService } from '../services/user.service';
import { User } from '../model/user.model';

interface UserValues {
      username: string | undefined;
      about: string | undefined;
}

export default function Profile (): JSX.Element {
      const { user, setUser } = AuthState()
      const [image, setImage] = useState<string>(user?.profileImg || '')
      const [editType, setEditType] = useState<'username' | 'about' | ''>('')
      const [userValues, setUserValues] = useState<UserValues>({
            username: user?.username ?? '',
            about: user?.about ?? '',
      });
      async function handleEdit () {
            if (!editType || !user) return
            if (userValues[editType as keyof UserValues] === user?.[editType] || userValues[editType as keyof UserValues] === '') {
                  return toast.error(`Please enter a valid ${editType}`);
            }
            const valueToEdit = userValues[editType as keyof UserValues] as string;
            const newUser = await userService.editUserDetails(valueToEdit, editType)
            setUser(newUser)
            setEditType('')
            toast.success(`${editType} changed successfully`)
      }

      async function handleImageChange (newImage: string): Promise<void> {
            setImage(newImage)
            const savedImage = await userService.updateUserImage(newImage)
            const userToSave = {
                  ...user,
                  profileImg: savedImage,
            } as User
            setUser(userToSave)
      }

      return (
            <section>
                  <UploadImage image={image} setImage={handleImageChange} />

                  <div className='px-6 py-10'>
                        <span className='text-primary'>Your Name</span>
                        <div className='flex items-center gap-x-2 py-5'>
                              {editType === 'username' ? (
                                    <>
                                          <CheckIcon fontSize='small' className='text-primary cursor-pointer' onClick={handleEdit} />
                                          <input
                                                type="text"
                                                className='border-b-2 w-full px-2 border-primary'
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
                                          <span className='text-gray-500'>{user?.username}</span>
                                    </>
                              )}
                        </div>

                        <div className='py-10'>
                              <span className='text-primary'>About</span>
                              <div className='flex items-center gap-x-2 py-5'>
                                    {editType === 'about' ? (
                                          <>
                                                <CheckIcon fontSize='small' className='text-primary cursor-pointer' onClick={handleEdit} />
                                                <input
                                                      type="text"
                                                      className='border-b-2 w-full px-2 border-primary'
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
                                                <span className='text-gray-500'>{user?.about}</span>
                                          </>
                                    )}
                              </div>
                        </div>
                  </div>
            </section>
      )
}

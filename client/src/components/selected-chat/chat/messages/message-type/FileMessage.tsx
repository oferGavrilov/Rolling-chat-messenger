import { IMessage } from '../../../../../model/message.model'
import { formatBytesToKB, onDownloadFile } from '../../../../../utils/functions'

interface Props {
      message: IMessage
      setSelectedFile: (message: IMessage) => void
}

export default function FileMessage({ message, setSelectedFile }: Props): JSX.Element {
      const onSetSelectedFile = (message: IMessage) => {
            if (message._id === 'temp-id') return
            setSelectedFile(message)
      }

      if (!message || !message.fileUrl) return <div></div>
      return (
            <div className="relative px-[2px] pt-[2px] overflow-hidden">
                  <div className='flex flex-col'>
                        {/* temp-id means the message is still the optimistic message */}
                        {(message._id !== 'temp-id') ? (<div
                              style={{ backgroundImage: `url(${message.TN_Image})` }}
                              className='h-[100px] w-[330px] rounded-t-lg bg-cover bg-top cursor-pointer'
                              onClick={() => onSetSelectedFile(message)}
                              role='button'
                              title='Click to view file'
                              aria-label='Click to view file'
                        />
                        ) : (
                              <div className='h-[100px] w-[330px] rounded-t-lg bg-gray-300 animate-pulse' />
                        )}

                        <div className='bg-inherit w-full p-3 px-6 rounded-b-lg'>
                              <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-3'>
                                          <img src="/imgs/chat/pdf.png" alt="" className='w-7 h-8' />
                                          <div className='flex flex-col'>
                                                <span className='text-sm'>{message.fileName}</span>
                                                <div className='text-document-text text-xs'>
                                                      <span>1 page</span>
                                                      <span className='mx-1'>&#x2022;</span>
                                                      <span>PDF</span>
                                                      <span className='mx-1'>&#x2022;</span>
                                                      {message.messageSize && <span>{formatBytesToKB(message.messageSize)} KB</span>}
                                                </div>
                                          </div>
                                    </div>
                                    {(message._id !== 'temp-id') ? (
                                          <div
                                                className='border border-gray-400 rounded-full flex items-center justify-center cursor-pointer hover:border-gray-100'
                                                onClick={() => onDownloadFile(message)}
                                                role='button'
                                                title='Download file'
                                                aria-label='Download file'
                                          >
                                                <span className="material-symbols-outlined text-gray-400 text-md leading-none p-1">arrow_downward</span>
                                          </div>
                                    ) : <div className='spinner'></div>}
                              </div>
                        </div>

                        <div>
                              {message.content && <p className='text-sm md:text-base px-3 py-2'>{message.content as string}</p>}
                        </div>
                  </div>

            </div>
      )
}

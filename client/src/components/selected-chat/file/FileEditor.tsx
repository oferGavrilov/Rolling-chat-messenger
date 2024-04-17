import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import useStore from '../../../context/store/useStore'
import { IReplyMessage } from '../../../model/message.model'
import { useClickOutside } from '../../../custom-hook/useClickOutside'
import { ITool, useCanvasEditor } from '../../../custom-hook/useCanvasHook'

interface Props {
      file: File | null
      setChatMode: React.Dispatch<React.SetStateAction<"chat" | "info" | "edit-file">>
      sendMessage: (message: string, type: 'text' | 'image' | 'audio' | 'file', replyMessage: IReplyMessage | null, recordingTimer?: number, file?: File) => Promise<void>
}


export default function FileEditor({ file, setChatMode, sendMessage }: Props) {
      const { replyMessage } = useStore()
      const [fileSrc, setFileSrc] = useState<string | null>(null)
      const [isLoading, setIsLoading] = useState<boolean>(false)
      const [selectedTool, setSelectedTool] = useState<ITool | null>(null)
      const [textMessage, setTextMessage] = useState<string>('')
      const fileEditorRef = React.createRef<HTMLDivElement>()

      useClickOutside(fileEditorRef, () => setChatMode('chat'), true)

      useEffect(() => {
            if (file) {
                  const objectUrl = URL.createObjectURL(file)
                  setFileSrc(objectUrl)

                  // return () => URL.revokeObjectURL(objectUrl);
            }
      }, [file])

      const {
            canvasRef,
            color,
            brushSize,
            hasRotated,
            texts,
            redoSteps,
            undoSteps,
            addText,
            onDoubleClickText,
            onBlurText,
            setColor,
            setBrushSize,
            undo,
            redo,
            resetRotation,
            rotateLeft,
            rotateRight
      } = useCanvasEditor({
            fileEditorRef,
            imageSrc: fileSrc || '',
            isDrawingEnabled: selectedTool === 'draw',
            setSelectedTool
      });

      const isImage = file && file.type.startsWith('image/')

      async function uploadFileAndSend(): Promise<void> {
            if (!file || !fileSrc) return
            const type = isImage ? 'image' : 'file'
            setIsLoading(true)
            try {
                  setChatMode('chat')

                  if (isImage) {
                        if (!canvasRef.current) return console.error('Canvas ref is not available')

                        canvasRef.current.toBlob(async (blob) => {
                              if (!blob) return console.error('Failed to convert canvas to blob')
                              const fileFromCanvas = new File([blob], file.name, { type: file.type, lastModified: new Date().getTime() })
                              await sendMessage(textMessage, type, replyMessage, fileFromCanvas.size, fileFromCanvas)
                        }, file.type)
                  } else {

                        // URL.revokeObjectURL(fileSrc)
                        await sendMessage(textMessage, type, replyMessage, file.size, file)
                  }

            } catch (err) {
                  console.error('Failed to upload file:', err)
            } finally {
                  setIsLoading(false)
            }
      }

      function onSelectedTool(tool: ITool) {
            if (selectedTool === tool) {
                  setSelectedTool(null)
                  return
            }

            if (tool === 'text') {
                  addText()
            }

            setSelectedTool(tool)
      }

      if (!fileSrc) return <div></div>

      return (
            <div className='bg-white h-full dark:bg-dark-secondary-bg relative' ref={fileEditorRef}>
                  <div className={`flex justify-center w-full h-full`}>
                        <div className='flex flex-col w-full h-full'>
                              <div className='flex flex-col flex-1 h-full relative items-center justify-between'>
                                    <div className='w-full '>
                                          {isImage ? (

                                                <div className='flex items-center justify-center gap-3 h-14 py-2 px-4'>
                                                      <button className={`editor-tool-btn relative ${redoSteps === 0 ? 'pointer-events-none opacity-30' : ''}`} title='redo' onClick={redo}>
                                                            <span className='material-symbols-outlined'>redo</span>
                                                            {redoSteps > 0 && <span className='absolute right-0 top-0 bg-primary/80 w-4 h-4 rounded-full text-xs'>{redoSteps}</span>}
                                                      </button>
                                                      <button className={`editor-tool-btn relative ${undoSteps === 0 ? 'pointer-events-none opacity-30' : ''}`} title='undo' onClick={undo}>
                                                            <span className='material-symbols-outlined'>undo</span>
                                                            {undoSteps > 0 && <span className='absolute right-0 top-0 bg-primary/80 w-4 h-4 rounded-full text-xs'>{undoSteps}</span>}
                                                      </button>
                                                      <button className={`material-symbols-outlined editor-tool-btn ${selectedTool === 'crop' ? 'bg-gray-600' : ''}`} onClick={() => onSelectedTool('crop')}>crop</button>
                                                      <button className={`material-symbols-outlined editor-tool-btn ${selectedTool === 'draw' ? 'bg-gray-600' : ''}`} onClick={() => onSelectedTool('draw')}>draw</button>
                                                      {/* <button className={`material-symbols-outlined editor-tool-btn ${selectedTool === 'text' ? 'bg-gray-600' : ''}`} onClick={() => onSelectedTool('text')}>title</button>
                                                      <button className={`material-symbols-outlined editor-tool-btn ${selectedTool === 'emoji' ? 'bg-gray-600' : ''}`} onClick={() => onSelectedTool('emoji')}>mood</button> */}
                                                </div>
                                          ) : (
                                                <div className='flex items-center justify-center text-white pb-2'>
                                                      <span>{file?.name}</span>
                                                </div>
                                          )}
                                    </div>
                                    {isImage ? (
                                          <>
                                                <div className='w-full flex items-center justify-center mx-auto'>
                                                      <canvas ref={canvasRef} className='w-auto h-auto'></canvas>
                                                      {texts.map((text, index) => (
                                                            text.isEditing ? (
                                                                  <div
                                                                        key={index}
                                                                        className="content-editable"
                                                                        style={{ top: text.y, left: text.x, position: 'absolute', zIndex: 10, outline: '1px solid #ff4a4a', cursor: 'text', color: 'black' }}
                                                                        contentEditable={text.isEditing}
                                                                        suppressContentEditableWarning={true}
                                                                        onBlur={(e) => onBlurText(index, e)}
                                                                        onDoubleClick={() => onDoubleClickText(index)}
                                                                        onFocus={(e) => {
                                                                              e.currentTarget.style.outline = '2px solid #ff4a4a'
                                                                        }}
                                                                        dangerouslySetInnerHTML={{ __html: text.text }}
                                                                        aria-placeholder='Type here...'
                                                                  />
                                                            ) : (
                                                                  <div
                                                                        key={index}
                                                                        className="absolute"
                                                                        style={{ top: text.y, left: text.x }}
                                                                        onDoubleClick={() => onDoubleClickText(index)}
                                                                  >
                                                                        {text.text}
                                                                  </div>
                                                            )
                                                      ))}
                                                </div>

                                                <div className={`mx-auto w-full absolute bottom-8 transition-all duration-300 ${selectedTool ? 'opacity-100 max-h-14' : 'max-h-0 opacity-0'} `}>
                                                      {selectedTool === 'draw' && (
                                                            <div className='flex items-center justify-between h-full'>
                                                                  <div className='flex gap-2 items-center mx-4'>
                                                                        <button className={`brush-size-btn w-7 h-7 ${brushSize === 7 ? 'outline outline-1 outline-white' : ''}`} onClick={() => setBrushSize(7)} />
                                                                        <button className={`brush-size-btn w-6 h-6 ${brushSize === 5 ? 'outline outline-1 outline-white' : ''}`} onClick={() => setBrushSize(5)} />
                                                                        <button className={`brush-size-btn w-5 h-5 ${brushSize === 3 ? 'outline outline-1 outline-white' : ''}`} onClick={() => setBrushSize(3)} />
                                                                        <button className={`brush-size-btn w-4 h-4 ${brushSize === 1 ? 'outline outline-1 outline-white' : ''}`} onClick={() => setBrushSize(1)} />
                                                                  </div>

                                                                  <div className='flex gap-2 mx-4'>
                                                                        <button style={{ backgroundColor: '#ff4a4a', outline: color === '#ff4a4a' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#ff4a4a')} />
                                                                        <button style={{ backgroundColor: '#f49226', outline: color === '#f49226' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#f49226')} />
                                                                        <button style={{ backgroundColor: '#bd73ff', outline: color === '#bd73ff' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#bd73ff')} />
                                                                        <button style={{ backgroundColor: '#64dc2f', outline: color === '#64dc2f' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#64dc2f')} />
                                                                        <button style={{ backgroundColor: '#33ceff', outline: color === '#33ceff' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#33ceff')} />
                                                                        <button style={{ backgroundColor: '#ffffff', outline: color === '#ffffff' ? '2px solid black' : 'none' }} className='brush-color-btn' onClick={() => setColor('#ffffff')} />
                                                                        <button style={{ backgroundColor: '#9da0a9', outline: color === '#9da0a9' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#9da0a9')} />
                                                                        <button style={{ backgroundColor: '#434343', outline: color === '#434343' ? '2px solid white' : 'none' }} className='brush-color-btn' onClick={() => setColor('#434343')} />
                                                                  </div>
                                                            </div>
                                                      )}
                                                      {selectedTool === 'crop' && (
                                                            <div className='text-white flex items-center justify-center gap-4 h-full'>
                                                                  <button className={`${!hasRotated ? 'pointer-events-none opacity-30' : ''}`} onClick={resetRotation}>Clear</button>
                                                                  <button className='material-symbols-outlined' onClick={rotateLeft}>rotate_left</button>
                                                                  <button className='material-symbols-outlined' onClick={rotateRight}>rotate_right</button>
                                                            </div>
                                                      )}
                                                </div>
                                          </>
                                    ) : (
                                          <iframe
                                                src={fileSrc}
                                                title="picked-file"
                                                allowFullScreen={true}
                                                className="w-4/5 h-full"
                                          ></iframe>
                                    )
                                    }

                                    {!selectedTool && (
                                          <div className='flex items-center w-4/5 my-5 gap-4 text-white'>
                                                <button onClick={uploadFileAndSend}
                                                      role='button'
                                                      aria-label='send file'
                                                      tabIndex={0}
                                                      title="Send File"
                                                      disabled={isLoading}
                                                      className={`bg-primary h-max p-3 inline-block rounded-full shadow-gray-950 shadow-md `}>

                                                      {isLoading ? (
                                                            <div className='spinner'></div>
                                                      ) : (
                                                            <SendIcon className='rotate-180' />
                                                      )}
                                                </button>

                                                <div className='w-full relative'>
                                                      {/* <div
                                                      className="content-editable-message-input"
                                                      style={{ position: 'relative', zIndex: 10 }}
                                                      contentEditable={true}
                                                      suppressContentEditableWarning={true}
                                                      aria-placeholder='Type here...'
                                                      dangerouslySetInnerHTML={{ __html: textMessage }}
                                                      onInput={(e) => setTextMessage(e.currentTarget.innerHTML)}
                                                /> */}
                                                      <textarea
                                                            className='file-editor-message-textarea'
                                                            value={textMessage}
                                                            onChange={(e) => setTextMessage(e.target.value)}
                                                            placeholder='Send a message...'
                                                      ></textarea>
                                                </div>
                                          </div>
                                    )}
                              </div>


                        </div>
                  </div>
                  {!isLoading && (
                        <CloseIcon
                              className='absolute top-4 right-4 text-black dark:text-white cursor-pointer'
                              role='button'
                              aria-label='close'
                              tabIndex={1}
                              color='inherit'
                              titleAccess='close file editor'
                              onClick={() => setChatMode('chat')}
                        />
                  )}
            </div>
      )
}

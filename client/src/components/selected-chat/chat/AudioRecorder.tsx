import React, { useState, useEffect, useRef } from 'react'

import { formatRecordTimer } from '../../../utils/functions'

import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'
import { toast } from 'react-toastify'

interface AudioRecorderProps {
      onSendAudio: (audioBlob: Blob, recordingTimer: number) => void
      isRecording: boolean
      setIsRecording: React.Dispatch<React.SetStateAction<boolean>>
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSendAudio, isRecording, setIsRecording }) => {
      const [recordingTimer, setRecordingTimer] = useState<number>(0)
      const mediaRecorderRef = useRef<MediaRecorder | null>(null)
      const sendAudioRef = useRef<boolean>(false)
      const chunksRef = useRef<Blob[]>([])
      const startTimeRef = useRef<number | null>(null)

      useEffect(() => {
            let timerId: ReturnType<typeof setInterval> | undefined = undefined;

            if (isRecording) {
                  startTimeRef.current = performance.now()
                  timerId = setInterval(() => {
                        if (startTimeRef.current !== null) {
                              const elapsedTime = performance.now() - +startTimeRef.current
                              setRecordingTimer(Math.floor(elapsedTime))
                        }
                  }, 1000)
            } else {
                  clearInterval(timerId)
                  if (startTimeRef.current !== null) {
                        const elapsedTime = performance.now() - +startTimeRef.current
                        setRecordingTimer(Math.floor(elapsedTime))
                  }
                  startTimeRef.current = null
            }

            return () => clearInterval(timerId)
      }, [isRecording])

      const startRecording = async () => {
            try {
                  chunksRef.current = []
                  setRecordingTimer(0)

                  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                  mediaRecorderRef.current = new MediaRecorder(stream)

                  mediaRecorderRef.current.ondataavailable = (e) => {

                        if (e.data.size > 0) {
                              chunksRef.current.push(e.data)
                        } else {
                              toast.error('No audio recorded')
                        }
                  }

                  mediaRecorderRef.current.onstop = () => {
                        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

                        if (sendAudioRef.current && audioBlob.size > 0) {
                              onSendAudio(audioBlob, recordingTimer)
                        }

                        chunksRef.current = []
                        mediaRecorderRef.current = null

                        if (stream) {
                              stream.getTracks().forEach(track => track.stop());
                        }

                        setRecordingTimer(0)
                        setIsRecording(false)
                  }

                  mediaRecorderRef.current.start()
                  setIsRecording(true)
            } catch (error) {
                  if ((error as Error).name === 'NotAllowedError' || (error as Error).name === 'NotSupportedError') {
                        toast.error('Error accessing media devices, please allow access to the microphone and try again')
                  }
                  console.error('Error accessing media devices:', error)
            }
      }

      function onCancelRecording (): void {
            sendAudioRef.current = false
            mediaRecorderRef.current?.stop()
      }

      function onSendRecording (): void {
            sendAudioRef.current = true
            mediaRecorderRef.current?.stop()
      }

      return (
            <div className={`dark:text-dark-primary-text ${isRecording ? 'w-full' : ''}`}>
                  {isRecording ? (
                        <div className='ml-8 mr-4 flex justify-between items-center'>
                              <div className='flex w-20 justify-between animate-pulse'>
                                    <p>{formatRecordTimer(recordingTimer)}</p>
                                    <RadioButtonCheckedIcon className='text-red-500' />
                              </div>
                              <div className='flex gap-x-4'>
                                    <div className='record-icon ' onClick={onCancelRecording}>
                                          <DeleteIcon className='text-red-500 !text-3xl' />
                                    </div>
                                    <div className='record-icon' onClick={onSendRecording}>
                                          <SendIcon className='!text-[27px]' />
                                    </div>
                              </div>
                        </div>
                  ) : (
                        <div className='record-icon mx-2'>
                              <KeyboardVoiceIcon onClick={startRecording} />
                        </div>
                  )}
            </div>
      )
}


export default AudioRecorder

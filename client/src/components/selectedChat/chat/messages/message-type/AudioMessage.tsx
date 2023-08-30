import React, { useState, useRef } from 'react'
import { formatRecordTimer } from '../../../../../utils/functions'
import { IMessage } from '../../../../../model/message.model'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface AudioMessageProps {
      message: IMessage
}

const AudioMessage: React.FC<AudioMessageProps> = ({ message }) => {
      const [isPlaying, setIsPlaying] = useState(false)
      const audioRef = useRef<HTMLAudioElement | null>(null)
      const progressBarRef = useRef<HTMLDivElement | null>(null)

      const togglePlay = () => {
            const audioElement = audioRef.current
            if (audioElement) {
                  if (audioElement.paused) {
                        audioElement.play()
                        setIsPlaying(true)
                  } else {
                        audioElement.pause()
                        setIsPlaying(false)
                  }
            }
      }
      const updateProgressBar = () => {
            const audioElement = audioRef.current
            if (audioElement && progressBarRef.current) {
                  const currentTime = audioElement.currentTime
                  const duration = audioElement.duration
                  const progressBarWidth = (currentTime / duration) * 150 // Width in pixels

                  progressBarRef.current.style.width = `${progressBarWidth}px`
            }
      }

      return (
            <div className="relative max-h-[65px] flex items-center justify-between w-full px-2 py-4">
                  {/* Play/Pause button */}
                  <img
                        src={message.sender.profileImg}
                        alt="profile-image"
                        className='w-11 h-11 rounded-full object-cover object-top mx-2'
                  />

                  <div className='flex items-center'>
                        <button
                              className="mr-2"
                              onClick={togglePlay}
                        >
                              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                        </button>


                        {/* Audio player */}
                        <audio
                              ref={audioRef}
                              onPlay={() => setIsPlaying(true)}
                              onPause={() => setIsPlaying(false)}
                              onTimeUpdate={updateProgressBar}
                              onEnded={() => {
                                    setIsPlaying(false)
                                    progressBarRef.current!.style.width = '0px'
                              }}
                        >
                              <source src={message.content.toString()} type="audio/webm" />
                              <source src={message.content.toString()} type="audio/mpeg" />
                              <source src={message.content.toString()} type="audio/wav" />
                        </audio>

                        {/* Progress bar */}
                        <div className='flex flex-col h-full justify-center'>
                              <div className="bg-gray-200 w-36 h-2 rounded-lg">
                                    <div
                                          ref={progressBarRef}
                                          className="bg-gray-500 h-full transition-all duration-300 ease-linear rounded-lg"
                                          style={{ width: '0px' }}
                                    />
                              </div>
                              {message?.messageSize !== 0 && (
                                    <span className="text-xs text-gray-200 absolute bottom-1 right-4">
                                          {formatRecordTimer(message.messageSize as number)}
                                    </span>
                              )}
                        </div>
                  </div>

            </div>
      )
}

export default AudioMessage

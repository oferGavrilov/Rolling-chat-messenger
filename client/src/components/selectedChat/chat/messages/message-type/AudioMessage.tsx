import React, { useState, useRef } from 'react'
import { formatRecordTimer, isSameSenderMargin } from '../../../../../utils/functions'
import { IMessage } from '../../../../../model/message.model'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'

interface AudioMessageProps {
      message: IMessage
      messages: IMessage[]
      idx: number
      userId: string
}

const AudioMessage: React.FC<AudioMessageProps> = ({ message, messages, idx, userId }) => {
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
            <div className="relative w-[240px] h-[60px] flex items-center px-2">
                  {/* Play/Pause button */}
                  <img
                        src={message.sender.profileImg}
                        alt="profile-image"
                        className={`${isSameSenderMargin(messages, message, idx, userId) ? '-left-11' : '-right-10'} w-11 h-11 rounded-full object-cover object-top`}
                  />

                  <button
                        className=" mr-2"
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
                        {message?.messageSize !== 0 && <span className="text-xs absolute bottom-0">{formatRecordTimer(message.messageSize as number)}</span>}
                  </div>

                  {/* Other message elements */}
            </div>
      )
}

export default AudioMessage

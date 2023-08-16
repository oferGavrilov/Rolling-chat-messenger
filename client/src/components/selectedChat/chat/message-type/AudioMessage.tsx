import React, { useState, useRef } from 'react';
import { formatRecordTimer, isSameSenderMargin } from '../../../../utils/functions';
import { IMessage } from '../../../../model/message.model';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface AudioMessageProps {
      message: IMessage;
      messages: IMessage[];
      idx: number;
      userId: string;
}

const AudioMessage: React.FC<AudioMessageProps> = ({ message, messages, idx, userId }) => {
      const [isPlaying, setIsPlaying] = useState(false);
      const audioRef = useRef<HTMLAudioElement | null>(null);
      const progressBarRef = useRef<HTMLDivElement | null>(null);

      const togglePlay = () => {
            const audioElement = audioRef.current;
            if (audioElement) {
                  if (audioElement.paused) {
                        audioElement.play();
                        setIsPlaying(true);
                  } else {
                        audioElement.pause();
                        setIsPlaying(false);
                  }
            }
      };
      const updateProgressBar = () => {
            const audioElement = audioRef.current;
            if (audioElement && progressBarRef.current) {
                  const currentTime = audioElement.currentTime;
                  const duration = audioElement.duration;
                  const progressBarWidth = (currentTime / duration) * 150; // Width in pixels

                  progressBarRef.current.style.width = `${progressBarWidth}px`;
            }
      };

      return (
            <div className="relative w-[200px] h-[60px] flex items-center">
                  {/* Play/Pause button */}
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
                              setIsPlaying(false);
                              progressBarRef.current!.style.width = '0px';
                        }}
                  >
                        <source src={message.content.toString()} type="audio/webm" />
                  </audio>

                  {/* Progress bar */}
                  <div className="bg-gray-200 w-36 h-2 rounded-lg">
                        <div
                              ref={progressBarRef}
                              className="bg-gray-500 h-full transition-all duration-300 ease-linear rounded-lg"
                              style={{ width: '0px' }} // Initial width is 0
                        />
                  </div>

                  {/* Other message elements */}
                  <img
                        src={message.sender.profileImg}
                        alt="profile-image"
                        className={`${isSameSenderMargin(messages, message, idx, userId) ? '-left-11' : '-right-10'} w-8 h-8 rounded-full object-cover object-top absolute top-1`}
                  />
                  {message?.messageSize !== 0 && <span className="absolute text-black text-xs bottom-0 right-12">{formatRecordTimer(message.messageSize as number)}</span>}
            </div>
      );
};

export default AudioMessage;

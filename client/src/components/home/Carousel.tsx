import { useState } from 'react'
import SpeedIcon from '@mui/icons-material/Speed';
import MicIcon from '@mui/icons-material/Mic';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import PermMediaRoundedIcon from '@mui/icons-material/PermMediaRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import FormatColorFillRoundedIcon from '@mui/icons-material/FormatColorFillRounded';


export default function Carousel (): JSX.Element {
      const [isCarouselPaused, setCarouselPaused] = useState(false);

      const handleCarouselHover = (hovered: boolean) => {
            setCarouselPaused(hovered);
      };
      return (
            <div className="carousel-container">
                  <div
                        className="carousel-slider"
                        onMouseEnter={() => handleCarouselHover(true)}
                        onMouseLeave={() => handleCarouselHover(false)}
                        style={{ animationPlayState: isCarouselPaused ? "paused" : "running" }}
                  >
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Fast and secure messaging
                                    <SpeedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Video Calls
                                    <VideocamRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Audio Messages
                                    <MicIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    File Sharing
                                    <PermMediaRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Group Chats
                                    <GroupsRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Emojis
                                    <SentimentSatisfiedAltRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Theme Customization
                                    <FormatColorFillRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        {/* Duplicate the content for looping */}
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Fast and secure messaging
                                    <SpeedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Video Calls
                                    <VideocamRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Audio Messages
                                    <MicIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    File Sharing
                                    <PermMediaRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Group Chats
                                    <GroupsRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Emojis
                                    <SentimentSatisfiedAltRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Theme Customization
                                    <FormatColorFillRoundedIcon className="!text-5xl" />
                              </div>
                        </div>
                  </div>
            </div>
      )
}

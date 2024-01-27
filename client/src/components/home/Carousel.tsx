import { useState } from 'react'

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
                                    <span className="material-symbols-outlined text-5xl">speed</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Video Calls
                                    <span className="material-symbols-outlined text-5xl">camera_video</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Audio Messages
                                    <span className="material-symbols-outlined text-5xl">mic</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    File Sharing
                                    <span className="material-symbols-outlined text-5xl">file_copy</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Real-Time Notification
                                    <span className="material-symbols-outlined text-5xl">emergency_share</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Group Chats
                                    <span className="material-symbols-outlined text-5xl">groups</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Image Editor
                                    <span className="material-symbols-outlined text-5xl">crop</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    End-To-End Encryption
                                    <span className="material-symbols-outlined text-5xl">verified_user</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Theme Customization
                                    <span className="material-symbols-outlined text-5xl">settings_night_sight</span>
                              </div>
                        </div>
                        {/* Duplicate the content for looping */}
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Theme Customization
                                    <span className="material-symbols-outlined text-5xl">settings_night_sight</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    End-To-End Encryption
                                    <span className="material-symbols-outlined text-5xl">verified_user</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Image Editor
                                    <span className="material-symbols-outlined text-5xl">crop</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Group Chats
                                    <span className="material-symbols-outlined text-5xl">groups</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Real-Time Notification
                                    <span className="material-symbols-outlined text-5xl">emergency_share</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    File Sharing
                                    <span className="material-symbols-outlined text-5xl">file_copy</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Audio Messages
                                    <span className="material-symbols-outlined text-5xl">mic</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Video Calls
                                    <span className="material-symbols-outlined text-5xl">camera_video</span>
                              </div>
                        </div>
                        <div className="carousel-card">
                              <div className="carousel-content">
                                    Fast and secure messaging
                                    <span className="material-symbols-outlined text-5xl">speed</span>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

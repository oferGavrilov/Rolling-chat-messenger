import PermMediaIcon from '@mui/icons-material/PermMedia'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import { BsFillCameraVideoFill } from 'react-icons/bs'
import useIntersectionObserver from "../../custom-hook/useIntersectionObserver"

export default function Features() {

      const showOnScrollRef = useIntersectionObserver(
            (entries, observer) => {
                  entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                              entry.target.classList.add("fade-in")
                              observer.unobserve(entry.target)
                        }
                  })
            },
            { root: null, rootMargin: "0px", threshold: 0.1 }
      )

      return (

            <div className="min-h-screen">
                  <div className="flex flex-col gap-8 text-white w-[85%] md:w-2/3 max-w-2xl mx-auto translate-y-0 transition-all duration-500 bg-primary opacity-0"ref={showOnScrollRef} >
                        <h2 className="text-3xl md:text-4xl tracking-wide font-bold py-8 text-center">Explore New World of Chatting</h2>
                        <img
                              src="https://res.cloudinary.com/dqkstk6dw/image/upload/v1693401441/chat-app/rolling3_oxoflj.png"
                              alt="hero-image"
                              loading="lazy"
                              className="opacity-95 rounded-xl shadow-2xl mx-auto"
                        />
                        <div className="w-full flex justify-between text-center h-28 md:h-36 text-sm md:text-lg tracking-wide text-neutral-100 font-bold uppercase mt-6">
                              <div className="flex flex-col items-center justify-between flex-1 h-24 lg:h-32">
                                    <span className="max-w-[85%] md:max-w-[75%]">Share images and files</span>
                                    <PermMediaIcon className="!text-3xl md:!text-5xl text-neutral-100" />
                              </div>

                              <div className="flex flex-col items-center flex-1 justify-between h-24 lg:h-32">
                                    <span className="max-w-[85%] md:max-w-[85%]">Send Voice messages</span>
                                    <KeyboardVoiceIcon className="!text-3xl md:!text-5xl text-neutral-100" />
                              </div>

                              <div className="flex flex-col items-center flex-1 justify-between h-24 lg:h-32">
                                    <span className="max-w-[70%] md:max-w-[70%]">Live Video calls</span>
                                    <BsFillCameraVideoFill className="!text-3xl md:!text-5xl text-neutral-100" />
                              </div>
                        </div>
                  </div>
                  {/* <WavesWhite className="bottom-0 md:-bottom-10 lg:-bottom-24 xl:-bottom-48" /> */}
            </div>
      )
}

import useIntersectionObserver from "../../custom-hook/useIntersectionObserver";

import { BsSun, BsMoon } from 'react-icons/bs'
import { MdOutlineColorLens } from 'react-icons/md'

import { CgColorBucket } from 'react-icons/cg'
import { WavesUpsideDown } from "../svg/Bubble";
export default function Views() {

      const showOnScrollRef = useIntersectionObserver(
            (entries, observer) => {
                  entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                              entry.target.classList.add("fade-in");
                              observer.unobserve(entry.target);
                        }
                  });
            },
            { root: null, rootMargin: "0px", threshold: 0.5 }
      );

      return (
            <div className="min-h-screen" >
                  <div className="flex flex-col">
                        <WavesUpsideDown />

                        <div className="relative w-[85%] md:w-2/3 mx-auto max-w-2xl translate-y-0 transition-all duration-500 flex-1 xl:-mt-8 overflow-hidden opacity-0" ref={showOnScrollRef}>
                              <h2 className="text-3xl md:text-5xl font-bold text-center pb-8">Choose your favorite view</h2>
                              <img
                                    src="https://res.cloudinary.com/dqkstk6dw/image/upload/v1693406469/chat-app/rolling1_cyagsg.png"
                                    alt="dark-mode"
                                    loading="lazy"
                                    className="opacity-95 shadow-2xl shadow-gray-400 rounded-xl w-4/5 m-auto"
                              />
                              <div className="flex justify-evenly text-center mt-6 h-28 text-sm md:text-lg uppercase tracking-wide font-bold">
                                    <div className="flex flex-col items-center gap-4">
                                          <span className="max-w-[80%]">Light / Dark Theme</span>
                                          <div className="flex gap-x-6 !text-3xl md:!text-4xl">
                                                <BsSun color="#f59e0b" />
                                                <BsMoon color="#a8a29e" />
                                          </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                          <span className="max-w-[70%]">Chat Background</span>
                                          <div className="flex gap-x-5 !text-3xl md:!text-4xl">
                                                <CgColorBucket color="#a78bfa" />
                                                <MdOutlineColorLens color="#2dd4bf" />
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      )
}

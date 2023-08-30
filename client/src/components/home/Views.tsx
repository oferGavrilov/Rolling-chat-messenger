import useIntersectionObserver from "../../custom/useIntersectionObserver";

import { BsSun, BsMoon } from 'react-icons/bs'
import { MdOutlineColorLens } from 'react-icons/md'

import { CgColorBucket } from 'react-icons/cg'
export default function Views () {

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
            <div className="min-h-[95svh] md:min-h-[100svh] relative">
                  <div className="w-[85%] md:w-2/3 mx-auto max-w-3xl opacity-0 translate-y-20 transition-all duration-500" ref={showOnScrollRef}>
                        <h2 className="text-3xl md:text-5xl font-bold text-center py-8">Choose your favorite view</h2>
                        <img
                              src="https://res.cloudinary.com/dqkstk6dw/image/upload/v1693406469/chat-app/rolling1_cyagsg.png"
                              alt="dark-mode"
                              loading="lazy"
                              className="opacity-95 shadow-2xl shadow-gray-400 rounded-xl"
                        />
                        <div className="flex justify-evenly text-center my-16 h-28 text-lg uppercase tracking-wide font-bold">
                              <div className="flex flex-col items-center justify-between">
                                    Light / Dark Theme
                                    <div className="flex gap-x-6 !text-4xl">
                                          <BsSun color="#f59e0b" />
                                          <BsMoon color="#a8a29e" />
                                    </div>
                              </div>
                              <div className="flex flex-col items-center justify-between">
                                    <span className="max-w-[70%]">Chat Background</span>
                                    <div className="flex gap-x-5 !text-4xl">
                                          <CgColorBucket color="#a78bfa" />
                                          <MdOutlineColorLens color="#2dd4bf" />
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full bg-primary">
                        <p className="text-neutral-200 text-center p-2">
                              © 2021 Rolling All rights reserved
                        </p>
                  </div>
            </div>
      )
}

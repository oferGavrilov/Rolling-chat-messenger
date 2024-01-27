import { Link } from "react-router-dom"
import { WavesBlue } from "../components/svg/Bubble"

import Features from "../components/home/Features";
import Views from "../components/home/Views";
// import Carousel from "../components/home/Carousel";


export default function Home(): JSX.Element {


      return (
            <section className="relative">
                  <div className="min-h-[100svh] relative">
                        <div className="slide-up relative">
                              <img src="imgs/logoname.png" className="w-/5 mx-auto max-w-[240px] lg:max-w-xs xl:max-w-sm 2xl:max-w-md my-12" alt="" />
                              <p className="text-center mx-[10%] drop-shadow-gray text-lg md:text-2xl tracking-wide leading-8 md:leading-9 md:[word-spacing:8px]">Discover a new way to connect with our innovative chat website.<br />
                                    From real-time messaging to voice and video calls, our platform brings people together, fostering collaboration, and enabling rich communication experiences.
                              </p>

                              <div className="flex justify-center py-20">
                                    <Link
                                          to="/chat"
                                          className="bg-primary w-max py-2 px-4 md:px-6 lg:text-xl text-white rounded-lg transition-all duration-200 hover:shadow-xl hover:tracking-wide">
                                          Get Started Free
                                    </Link>
                              </div>

                              {/* <Carousel /> */}
                        </div>
                        <WavesBlue className="slide-up bottom-0 md:-bottom-10 lg:-bottom-20" />
                  </div>
                  <Features />

                  <Views />
                  {/* <div className="absolute bottom-0 left-0 w-full bg-primary">
                        <p className="text-neutral-200 text-center p-2">
                              © 2021 Rolling All rights reserved
                        </p>
                  </div> */}
            </section>
      )
}

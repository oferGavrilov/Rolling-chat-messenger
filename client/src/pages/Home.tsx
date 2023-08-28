import { Link } from "react-router-dom"
import { WavesWhite, WavesBlue } from "../assets/icons/Bubble"

export default function Home (): JSX.Element {
      return (
            <section>
                  <div className="min-h-[100svh] relative">
                        <div className="slide-up relative">
                              <h1
                                    className="text-4xl md:text-8xl font-alfa font-bold pt-10 md:pt-16 pb-14 text-primary text-center 
                               drop-shadow-lg">
                                    Rolling
                              </h1>
                              <p className="text-center mx-[10%] drop-shadow-gray text-lg md:text-2xl tracking-wide leading-8 md:leading-9 md:[word-spacing:8px]">Discover a new way to connect with our innovative chat website.<br />
                                    From real-time messaging to voice and video calls, our platform brings people together, fostering collaboration, and enabling rich communication experiences.</p>

                              <div className="flex justify-center py-20">
                                    <Link to="/chat" className="bg-primary w-max py-2 px-4 md:px-6 text-xl text-white rounded-lg transition-all shadow duration-300 hover:custom-shadow">Get Started Free</Link>
                              </div>
                              <div className="hidden lg:block">
                                    <img src="svg/home.svg" alt="" className="w-64 absolute -bottom-52 right-32" />
                                    <img src="svg/home2.svg" alt="" className="w-64 absolute left-24 -bottom-28" />
                              </div>

                        </div>
                        <WavesBlue className="slide-up" />
                  </div>
                  <div className="min-h-[100svh] bg-primary relative -z-10">
                        <WavesWhite />
                  </div>

                  <div className="min-h-[100svh]">
                  </div>
            </section>
      )
}

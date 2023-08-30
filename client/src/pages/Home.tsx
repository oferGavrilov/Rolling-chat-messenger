import { Link } from "react-router-dom"
import { WavesBlue } from "../assets/icons/Bubble"

import Features from "../components/home/Features";
import Views from "../components/home/Views";
// import Carousel from "../components/home/Carousel";


export default function Home (): JSX.Element {


      return (
            <section>
                  <div className="min-h-[100svh] relative">
                        <div className="slide-up relative">
                              <img src="imgs/logoname.png" className="w-2/5 mx-auto max-w-md my-12" alt="" />
                              <p className="text-center mx-[10%] drop-shadow-gray text-lg md:text-2xl tracking-wide leading-8 md:leading-9 md:[word-spacing:8px]">Discover a new way to connect with our innovative chat website.<br />
                                    From real-time messaging to voice and video calls, our platform brings people together, fostering collaboration, and enabling rich communication experiences.
                              </p>

                              <div className="flex justify-center py-20">
                                    <Link to="/chat" className="bg-primary w-max py-2 px-4 md:px-6 text-xl text-white rounded-lg transition-all shadow duration-200 hover:shadow-xl">Get Started Free</Link>
                              </div>

                              {/* <Carousel /> */}
                        </div>
                        <WavesBlue className="slide-up" />
                  </div>
                  <Features />

                  <Views />
            </section>
      )
}

import { Link } from "react-router-dom"
import { WavesBlue } from "../components/svg/Bubble"
import Features from "../components/home/Features"
import Views from "../components/home/Views"
import MaxWidthWrapper from "../MaxWidthWrapper"

export default function Home(): JSX.Element {
      return (
            <section className="relative h-screen overflow-y-scroll">
                  {/* FIRST */}
                  <div className="min-h-[100svh] relative">
                        <MaxWidthWrapper>
                              <div className="slide-up relative">
                                    <div className="flex justify-center text-primary pt-8">
                                          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Rolling</h1>
                                    </div>

                                    <div className="text-lg md:text-2xl tracking-wide leading-4 md:[word-spacing:6px] flex flex-col items-center py-12 xl:py-16 mx-auto max-3xl">
                                          <h2 className="text-4xl !leading-[4.5rem] font-bold tracking-tight text-gray-900 text-center sm:text-6xl">
                                                Roll your chat with Rolling-
                                                The future of communication <span className="text-primary">is here.</span>
                                          </h2>
                                          <p className="mt-6 xl:mt-12 text-lg text-gray-500 text-center tracking-tight">
                                                Discover a new way to connect with our innovative chat website
                                                From real-time messaging to voice and video calls, our platform brings people together, fostering collaboration, and enabling rich communication experiences.
                                          </p>
                                    </div>
                                    
                                    <div className="flex justify-center">
                                          <Link
                                                to="/chat"
                                                className="bg-primary py-2 px-8 md:px-6 lg:text-xl text-white rounded-lg transition-all duration-200 hover:shadow-xl hover:tracking-wide">
                                                Get Started Free
                                          </Link>
                                    </div>

                                    {/* Features & Services */}
                                    {/* <div className="text-lg py-20 flex flex-col md:flex-row justify-evenly">
                                          <div className="feature-card">
                                                <h3 className="feature-title">Private Messaging</h3>
                                                <p className="feature-description">Securely connect with friends and colleagues through end-to-end encrypted private chats, ensuring your conversations remain confidential.</p>
                                                <div className="bg-primary rounded-full p-2.5">
                                                      <CiLock className="text-3xl text-white"/>
                                                </div>
                                          </div>

                                          <div className="feature-card">
                                                <h3 className="feature-title">Group Collaborations</h3>
                                                <p className="feature-description">Create dynamic group chats to collaborate on projects, plan events, or stay connected with your community, complete with extensive admin controls and customizability.</p>
                                                <div className="bg-primary rounded-full p-2.5">
                                                      <MdOutlineGroups className="text-3xl text-white" />
                                                </div>
                                          </div>

                                          <div className="feature-card">
                                                <h3 className="feature-title">Instant Video & Voice Calls</h3>
                                                <p className="feature-description">Elevate your conversations with high-quality video and voice calls, making your communications more engaging and personal, all within a few clicks.</p>
                                                <div className="bg-primary rounded-full p-2.5">
                                                      <BsCameraVideo className="text-3xl text-white"/>
                                                </div>
                                          </div>
                                    </div> */}
                              </div>
                        </MaxWidthWrapper>

                        <WavesBlue className="slide-up bottom-0 md:-bottom-10 lg:-bottom-20 2xl:-bottom-28 3xl:-bottom-36" />
                  </div>

                  {/* SECOND */}
                  <div className="min-h-screen bg-primary overflow-hidden">
                        <Features />
                  </div>

                  {/* THIRD */}
                  <div className=" min-h-screen overflow-hidden">
                        <Views />
                  </div>
            </section>
      )
}

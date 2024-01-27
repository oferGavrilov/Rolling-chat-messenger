import { Link } from "react-router-dom"
import Logo from "../components/svg/Logo"
import { WavesBlue } from "../components/svg/Bubble"

export default function NotFound (): JSX.Element {
      return (
            <div className="max-h-[100svh] flex flex-col items-center">
                  <Link to='/' className="py-6 ">
                        <Logo width="90" height="90" />
                  </Link>

                  <div className="text-center my-12 ">
                        <h2 className="text-7xl text-gray-700">Page not found</h2>
                        <p className="text-xl max-w-xl text-gray-500 mx-auto my-8">Uh oh, we can`&apos;`t seem to find the page you`&apos;`re looking for. Try going back to the previous page or click on the logo to return home</p>
                  </div>

                  <Link to='/' className="border-2 px-6 text-lg py-2 border-primary text-primary font-bold transition-colors duration-200 hover:bg-blue-100">
                        Go to home page
                  </Link>
                  <WavesBlue />
            </div>
      )
}

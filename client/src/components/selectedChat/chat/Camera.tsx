import React, { useRef, useCallback } from "react"
import Webcam from "react-webcam"
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty'
import { Tooltip } from "@mui/material"

interface Props {
      onCapture: (image: string) => void
}

const Camera: React.FC<Props> = ({ onCapture }) => {
      const webcamRef = useRef<Webcam>(null)
      const [isMirrored, setIsMirrored] = React.useState<boolean>(true)

      const captureImage = useCallback(() => {
            const imageSrc = webcamRef.current?.getScreenshot()
            if (imageSrc) {
                  onCapture(imageSrc)
            }
      }, [onCapture])

      return (
            <div className="flex flex-col items-center my-16 relative" >
                  <Webcam
                        audio={false}
                        ref={webcamRef}
                        mirrored={isMirrored}
                        screenshotFormat="image/jpeg"
                        className="w-full md:w-[90vw] lg:w-[80vw] xl:w-[50vw]"
                  />
                  <div onClick={captureImage} className="bg-primary dark:bg-dark-secondary-bg p-3 absolute -bottom-8 rounded-full cursor-pointer">
                        <PhotoCameraIcon className="text-white" fontSize="large" />
                  </div>
                  <Tooltip title="Rotate Camera" arrow >
                        <button
                              onClick={() => setIsMirrored(!isMirrored)}
                              className="bg-primary dark:bg-dark-secondary-bg p-2 rounded-full absolute right-[39%] -bottom-8 cursor-pointer">
                              <ThreeSixtyIcon className="text-white" />
                        </button>
                  </Tooltip>
            </div>
      )
}

export default Camera

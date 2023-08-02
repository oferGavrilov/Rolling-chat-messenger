import React, { useRef, useCallback } from "react"
import Webcam from "react-webcam"
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'

interface Props {
      onCapture: (image: string) => void
}

const Camera: React.FC<Props> = ({ onCapture }) => {
      const webcamRef = useRef<Webcam>(null)

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
              mirrored={true}
              screenshotFormat="image/jpeg"
              style={{ width: "100%", height: "auto" }}
            />
            <div onClick={captureImage} className="bg-primary p-3 rounded-full absolute -bottom-8 cursor-pointer">
              <PhotoCameraIcon className="text-white" fontSize="large"/>
            </div>
          </div>
      )
}

export default Camera

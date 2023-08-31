import { useState } from 'react'
import Loading from '../Loading'

interface ProfileImageProps {
      className?: string
      src: string | undefined
      alt?: string
      onClick?: () => void
}

export default function ProfileImage ({ className, src, alt = 'image', onClick }: ProfileImageProps): JSX.Element {
      const [isLoading, setIsLoading] = useState<boolean>(true)

      const handleImageLoaded = () => {
            setIsLoading(false)
      }
      return (
            <div className={`relative inline-block ${className}`}>
                  {isLoading || !src && (
                        <Loading />
                  )}
                  <img
                        className={`${className} ${isLoading || !src ? 'hidden' : ''}`}
                        src={src}
                        alt={alt}
                        onClick={onClick}
                        onLoad={handleImageLoaded}
                  />
            </div>
      )
}

import { useState } from 'react'

interface ProfileImageProps {
      className?: string
      src: string
      TN_src?: string
      alt?: string
      onClick?: () => void
}

export default function ProfileImage({ className, src, TN_src, alt = 'image', onClick }: ProfileImageProps): JSX.Element {
      const [isLoaded, setIsLoaded] = useState<boolean>(false);

      return (
            <div className={`relative inline-block ${className}`} onClick={onClick}>
                  {(TN_src && !isLoaded) && (
                        <img
                              className={`${className} absolute inset-0 w-full h-full`}
                              src={TN_src}
                              loading='lazy'
                              alt={alt}
                              style={{ opacity: isLoaded ? 0 : 1 }}
                        />
                  )}
                  <img
                        className={`${className} transition-opacity duration-500 ${TN_src ? 'absolute inset-0 w-full h-full' : ''}`}
                        src={src}
                        alt={alt}
                        loading='lazy'
                        onLoad={() => setIsLoaded(true)}
                        style={{ opacity: isLoaded ? 1 : 0 }}
                  />
            </div>
      );
}

import { useEffect, useState } from 'react';
import { IMessage } from '../../../../../model/message.model'

interface Props {
      message: IMessage
      setSelectedFile: (message: IMessage) => void
      userId: string
}

export default function ImageMessage({ message, setSelectedFile, userId }: Props) {
      const [currentImage, setCurrentImage] = useState<string | File>(message.TN_Image || message.content.toString());
      const [isLoaded, setIsLoaded] = useState<boolean>(!message.TN_Image);

      useEffect(() => {
            if (message.TN_Image) {
                  const image = new Image();
                  image.src = message.content.toString(); // This is the URL of the original image.
                  image.onload = () => {
                        setIsLoaded(true);
                        setCurrentImage(message.content.toString());
                  };
                  image.onerror = () => {
                        setIsLoaded(true);
                  }

                  return () => {
                        image.onload = null;
                        image.onerror = null;
                  }

            } else {
                  setCurrentImage(message.content.toString());
            }
      }, [message.TN_Image, message.content]);

      return (
            <div>
                  {(message.chat?.isGroupChat && message.sender._id !== userId) && (
                        <p
                              className='mx-3 font-bold text-green-400 text-sm max-w-44 overflow-ellipsis truncate'
                              aria-label={`Message sent by ${message.sender.username}`}
                              >
                              {message.sender.username}
                        </p>
                  )}

                  <img
                        className={`max-h-[300px] max-w-56 lg:max-w-64 xl:max-w-72 rounded-2xl object-cover object-top py-1 cursor-pointer px-2 ${!isLoaded ? `blur-sm ` : ''}`}
                        src={currentImage as string}
                        loading='lazy'
                        alt={`Message image from ${message.sender.username}`}
                        role="button"
                        tabIndex={0}
                        aria-label="Click to view the image in full screen"
                        onClick={() => setSelectedFile(message)}
                  />
            </div>
      )
}

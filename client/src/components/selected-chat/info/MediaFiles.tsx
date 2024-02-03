import { useEffect, useRef, useState } from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { IMessage } from '../../../model/message.model'
import useStore from '../../../context/store/useStore'

interface Props {
      messages: IMessage[]
}

export default function MediaFiles ({ messages }: Props): JSX.Element {
      const [showMessagesFiles, setShowMessagesFiles] = useState(false)
      const [showLeftButton, setShowLeftButton] = useState(false)
      const [showRightButton, setShowRightButton] = useState(false)

      const { setSelectedFile } = useStore()

      const messagesFilesRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
            if (!messagesFilesRef.current) return;
        
            const container = messagesFilesRef.current;
            setShowLeftButton(container.scrollLeft > 0);
        
            // Compare scrollLeft + container.clientWidth to container.scrollWidth - a small buffer value
            setShowRightButton(
                container.scrollLeft + container.clientWidth < container.scrollWidth - 5
            );
        
            const handleScroll = () => {
                setShowLeftButton(container.scrollLeft > 0);
        
                // Compare scrollLeft + container.clientWidth to container.scrollWidth - a small buffer value
                setShowRightButton(
                    container.scrollLeft + container.clientWidth < container.scrollWidth - 5
                );
            };
        
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }, [messagesFilesRef]);

      const scrollMessagesFiles = (direction: 'left' | 'right') => {
            if (!messagesFilesRef.current) return

            const container = messagesFilesRef.current
            const scrollAmount = 450

            if (direction === 'left') {
                  container.scrollLeft -= scrollAmount
            } else if (direction === 'right') {
                  container.scrollLeft += scrollAmount
            }
      }

      const messagesFiles = messages.filter(message => message.messageType === 'image')

      return (
            <div className="px-6 relative">
                  <div className={`flex justify-between items-center py-2 pt-2 text-gray-400 dark:text-gray-300 cursor-pointer dark:hover:text-primary hover:text-gray-700 ${messagesFiles.length <= 0 && 'pointer-events-none dark:text-gray-400'}`} onClick={() => setShowMessagesFiles(!showMessagesFiles)}>
                        <h2 className="text-lg">Media links and documents</h2>
                        <div className="flex items-center">
                              {messagesFiles.length}
                              <ExpandMoreIcon className={showMessagesFiles ? 'rotate-180' : ''} />
                        </div>
                  </div>

                  <div className={`flex gap-x-3 overflow-x-auto overflow-y-hidden relative scroll-smooth transition-[height] duration-300 ease-in-out hide-scrollbar ${showMessagesFiles ? 'h-[160px]' : 'h-[0px]'}`} ref={messagesFilesRef} >
                        {messagesFiles.map(message => (
                              <img
                                    key={message._id}
                                    className="object-cover w-[120px] h-[140px] object-center py-1 cursor-pointer"
                                    src={message.content.toString()}
                                    alt="conversation-user"
                                    onClick={() => setSelectedFile(message)}
                              />
                        ))}

                  </div>
                  {showMessagesFiles && showRightButton && (
                        <div
                              className="scroll-arrow-btn right-0"
                              onClick={() => scrollMessagesFiles('right')}
                        >
                              <KeyboardArrowRightIcon fontSize='large' />
                        </div>
                  )}

                  {showMessagesFiles && showLeftButton && (
                        <div
                              className="scroll-arrow-btn left-0"
                              onClick={() => scrollMessagesFiles('left')}
                        >
                              <KeyboardArrowLeftIcon fontSize='large' />
                        </div>)}
            </div>
      )
}

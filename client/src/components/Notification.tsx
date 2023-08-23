import { useEffect, useRef, useState } from 'react'
import { IMsg, eventBus } from '../services/event-bus.service'
import CloseIcon from '@mui/icons-material/Close'


export default function Notification (): JSX.Element {
      const [msg, setMsg] = useState<IMsg | null>(null)
      const timeoutIfRef = useRef<NodeJS.Timeout | null>(null)

      useEffect(() => {
            const unsubscribe = eventBus.on('show-msg', (msg) => {
                  setMsg(msg)
                  if (timeoutIfRef.current) clearTimeout(timeoutIfRef.current)
                  timeoutIfRef.current = setTimeout(closeMsg, 3000000)
            })

            return () => {
                  unsubscribe()
            }
      }, [])

      function closeMsg () {
            setMsg(null)
      }

      if (!msg) return (<></>)
      return (
            <div className={`notification-msg ${msg.type} slide-down text-xs md:text-lg`}>
                  <CloseIcon onClick={closeMsg} className='absolute right-1 top-1'/>
                  {msg.txt}
            </div>
      )
}

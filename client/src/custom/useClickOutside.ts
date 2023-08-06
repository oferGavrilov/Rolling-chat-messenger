
import { useEffect } from "react"


export function useClickOutside (
      ref: React.RefObject<HTMLElement>,
      callback: () => void,
      isActive: boolean
) {
      useEffect(() => {
            if (isActive) {
                  const handleClickOutside = (event: MouseEvent) => {
                        if (ref.current && !ref.current.contains(event.target as Node)) {
                              callback()
                        }
                  }

                  const handleEscapeKey = (event: KeyboardEvent) => {
                        if (event.key === 'Escape') {
                              callback()
                        }
                  }

                  document.addEventListener('mousedown', handleClickOutside)
                  document.addEventListener('keydown', handleEscapeKey)

                  return () => {
                        document.removeEventListener('mousedown', handleClickOutside)
                        document.removeEventListener('keydown', handleEscapeKey)
                  }
            }
      }, [ref, callback, isActive])
}
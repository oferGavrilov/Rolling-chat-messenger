import { useEffect, useRef } from "react"

type IntersectionObserverCallback = (
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver
) => void

function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit
): React.RefObject<HTMLDivElement> {
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = targetRef.current

    if (target) {
      const observer = new IntersectionObserver(callback, options)
      observer.observe(target)

      return () => observer.unobserve(target)
    }

    return undefined
  }, [callback, options])

  return targetRef
}

export default useIntersectionObserver

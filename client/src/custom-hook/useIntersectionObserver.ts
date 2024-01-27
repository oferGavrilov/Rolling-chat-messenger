import { useEffect, useRef } from "react";

type IntersectionObserverCallback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
) => void;

function useIntersectionObserver (
      callback: IntersectionObserverCallback,
      options: IntersectionObserverInit
): React.RefObject<HTMLDivElement> {
      const targetRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
            const observer = new IntersectionObserver(callback, options);
            if (targetRef.current) {
                  observer.observe(targetRef.current);
            }

            return () => {
                  if (targetRef.current) {
                        observer.unobserve(targetRef.current);
                  }
            };
      }, [callback, options]);

      return targetRef;
}

export default useIntersectionObserver;

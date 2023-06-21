export function debounce<T extends (...args: unknown[]) => void>(
      func: T,
      timeout = 700
    ) {
      let timer: ReturnType<typeof setTimeout>;
    
      return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    }
import { ReactElement, useState } from 'react'

export function useMultiStep (steps: ReactElement[]) {
      const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)

      function next (): void {
            setCurrentStepIndex(i => {
                  if (i > steps.length - 1) return i
                  return i + 1
            })
      }

      function back (): void {
            setCurrentStepIndex(i => {
                  if (i <= 0) return i
                  return i - 1
            })
      }

      function goTo (index: number): void {
            setCurrentStepIndex(index)
      }

      return {
            currentStepIndex,
            step: steps[currentStepIndex],
            next,
            back,
            goTo
      }
}

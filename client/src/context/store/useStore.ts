import { create } from 'zustand'

import { createChatSlice } from './chatStore'
import { createFileSlice } from './fileStore'


type Store = ReturnType<typeof createChatSlice> & ReturnType<typeof createFileSlice>

const useStore = create<Store>((set, get) => {
      return {
            ...createChatSlice(set, get),
            ...createFileSlice(set)
      }
})

export default useStore

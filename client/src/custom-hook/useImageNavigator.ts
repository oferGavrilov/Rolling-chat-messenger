import { useCallback, useState } from "react"
import { IMessage } from "../model/message.model"

interface UseImageNavigatorReturn {
    currentFile: IMessage | null
    setSelectedFileById: (id: string) => void
    canNavigateNext: boolean
    canNavigatePrev: boolean
}

export function useImageNavigator(filesInChat: IMessage[], initialSelectedFile: IMessage | null): UseImageNavigatorReturn {
    const [currentFile, setCurrentFile] = useState<IMessage | null>(initialSelectedFile)

    const fileIds = filesInChat.map(file => file._id)
    const currentIndex = currentFile ? fileIds.indexOf(currentFile._id) : -1

    const setSelectedFileById = useCallback((id: string) => {
        const file = filesInChat.find(file => file._id === id)
        if (!file) return
        setCurrentFile(file)
    }, [filesInChat])

    const canNavigatePrev = currentIndex > 0
    const canNavigateNext = currentIndex >= 0 && currentIndex < fileIds.length - 1

    return { currentFile, setSelectedFileById, canNavigateNext, canNavigatePrev }
}
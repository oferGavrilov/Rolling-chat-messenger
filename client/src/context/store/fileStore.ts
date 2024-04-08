import { IMessage } from "../../model"
import { IGallery } from "../../model/gallery"

export interface FileState {
    selectedFile: IMessage | null
    selectedImage: IGallery | null
    gallery: IGallery[]
    blobUrls: string[] // store blob urls for revoke later
}

export interface FileActions {
    setSelectedFile: (file: IMessage | null) => void
    setGallery: (galleryOrUpdater: IGallery[] | ((currentGallery: IGallery[]) => IGallery[])) => void
    setSelectedImage: (file: IGallery | null) => void
    setBlobUrls: (blobUrlOrUpdater: string[] | ((currentBlobUrls: string[]) => string[])) => void
}

export type FileStore = FileState & FileActions

export const createFileSlice = (set): FileStore => ({
    selectedFile: null,
    selectedImage: null,
    gallery: [],
    blobUrls: [],
    setSelectedFile: (file: IMessage | null) => set((state: FileState) => ({ ...state, selectedFile: file })),
    setSelectedImage: (image: IGallery | null) => set((state: FileState) => ({ ...state, selectedImage: image })),
    setGallery: (galleryOrUpdater: IGallery[] | ((currentGallery: IGallery[]) => IGallery[])) => {
        set((state: FileState) => {
            const newGallery = typeof galleryOrUpdater === 'function'
                ? galleryOrUpdater(state.gallery)
                : galleryOrUpdater
            return { ...state, gallery: newGallery }
        })
    },
    setBlobUrls: (blobUrlOrUpdater: string[] | ((currentBlobUrls: string[]) => string[])) => {
        set((state: FileState) => {
            const newBlobUrls = typeof blobUrlOrUpdater === 'function'
                ? blobUrlOrUpdater(state.blobUrls)
                : blobUrlOrUpdater
            return { ...state, blobUrls: newBlobUrls }
        })
    }
})
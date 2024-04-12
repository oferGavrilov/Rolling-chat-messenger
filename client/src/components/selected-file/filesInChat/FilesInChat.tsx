import { IMessage } from "../../../model"
import { formatTime } from '../../../utils/functions'
import ImageFile from "./file-types/ImageFile";
import PdfFile from "./file-types/PdfFile";

interface FilesInChatProps {
    files: IMessage[]
    setSelectedFileById: (id: string) => void
    currentFileId?: string
}

const renderFileContent = (file: IMessage): JSX.Element => {
    switch (file.messageType) {
        case 'image':
            return (
                <ImageFile file={file} />
            );
        case 'file':
            return <PdfFile />
        default:
            return <div></div>;
    }
};

export default function FilesInChat({ files, setSelectedFileById, currentFileId }: FilesInChatProps): JSX.Element {

    return (
        <>
            {files.map((file: IMessage) => (
                <div
                    key={file._id}
                    className={`flex flex-col flex-shrink-0 items-center gap-y-2 relative cursor-pointer object-cover w-[70px] h-[70px] rounded-lg hover:scale-110 transition-transform duration-300 ${currentFileId === file._id ? ' outline outline-2 outline-primary' : ''}`}
                    onClick={() => setSelectedFileById(file._id)}
                    role='button'
                    tabIndex={0}
                    aria-label='View file'
                >
                    {renderFileContent(file)}
                    <span className='absolute -bottom-6 text-white dark:text-gray-300 text-xs'>{formatTime(file.createdAt)}</span>
                </div>
            ))}
        </>
    )
}

import { IMessage } from '../../../../model'

export default function ImageFile({ file }: { file: IMessage }) {
    return (
        <img
            src={file.fileUrl}
            className='object-cover rounded-lg h-full w-full'
            alt={file.fileName || `${file.sender.username} sent this image.`}
            title='View image'
            tabIndex={0}
            role='button'
        />
    )
}

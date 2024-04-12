import { BsFiletypePdf } from "react-icons/bs";

export default function PdfFile() {
    return (
        <div
            className='bg-[#f14545] w-full h-full rounded-lg text-center flex items-center justify-center'
            role="button"
            tabIndex={0}
            aria-label='View file'
            title="View file"
        >
            <BsFiletypePdf className='text-gray-500 dark:text-gray-300 w-6 h-6' />
        </div>
    )
}

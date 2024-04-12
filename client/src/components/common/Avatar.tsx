
interface AvatarProps {
    src: string
    alt: string
    extraClassName?: string
    title?: string
}

export default function Avatar({ src, extraClassName, alt, title }: AvatarProps): JSX.Element {
    return (
        <img
            src={src}
            className={`w-full h-full object-cover ${extraClassName ? extraClassName : ''}`}
            alt={alt}
            title={title || alt}
        />
    )
}

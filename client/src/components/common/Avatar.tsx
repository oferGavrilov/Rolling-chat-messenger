
interface AvatarProps {
    src: string
    extraClassName?: string
    alt: string
}

export default function Avatar({ src, extraClassName, alt }: AvatarProps): JSX.Element {
    return (
        <img
            src={src}
            className={`w-full h-full object-cover ${extraClassName ? extraClassName : ''}`}
            alt={alt}
        />
    )
}

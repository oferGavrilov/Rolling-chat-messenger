
interface Props {
      className: "message-arrow" | "message-arrow-left" | "input-arrow"
}

export default function MessageArrow ({ className }: Props) {
      return (
            <div className={`shape ${className}`} />
      )
}


interface ButtonProps {
    children: React.ReactNode
    type: 'button' | 'submit'
    className?: string
    onClick?: () => void
    disabled?: boolean
    isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
    children,
    type,
    className,
    onClick,
    disabled,
    isLoading
}) => {
    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            type={type}>
            {isLoading ? <div className='spinner' /> : children}
        </button>
    );
};

export default Button;
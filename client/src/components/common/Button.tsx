import React from 'react'

interface ButtonProps {
  children?: React.ReactNode
  type: 'button' | 'submit'
  className?: string
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  ariaLabel?: string
  role?: string 
  style?: React.CSSProperties 
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  className,
  onClick,
  disabled,
  isLoading,
  ariaLabel,
  role = 'button', 
  style,
}) => {
  return (
    <button
      className={`${className ? className : ''} ${isLoading ? 'is-loading' : ''}`} 
      onClick={onClick}
      disabled={disabled || isLoading} 
      type={type}
      aria-label={ariaLabel || (typeof children === 'string' ? children : '')}
      role={role}
      style={style}
    >
      {isLoading ? (
        <>
          <div className="spinner" aria-hidden="true" /> 
          <span className="sr-only">Loading...</span> 
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default Button

import { Component, ErrorInfo, ReactNode } from 'react'
import Logo from './components/svg/Logo'
import { Link } from 'react-router-dom'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    error: Error | null
    errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { error: null, errorInfo: null }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        })
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <>

                    <div className='flex justify-center my-6'>
                        <Link
                            to="/"
                            className='flex justify-center'
                            title='Home'
                            aria-label='Home'
                            tabIndex={0}
                        >
                            <Logo />
                        </Link>
                    </div>

                    <Link
                        to='/'
                        className='bg-primary text-white block mx-12 p-2 text-center rounded-lg hover:bg-primary/90'
                    >
                        Return home
                    </Link>
                    <div style={{ margin: '20px', padding: '20px', background: '#fdd', border: '1px solid #d33' }}>
                        <h2>Something went wrong.</h2>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo.componentStack}
                        </details>
                    </div>
                </>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary

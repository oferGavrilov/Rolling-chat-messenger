import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { userService } from "../services/user.service"
import { toast } from "react-toastify"
import { FaUserAlt } from "react-icons/fa"
import Button from "../components/common/Button"

export default function ResetPassword() {
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { token } = useParams<{ token: string }>()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) return toast.warn("Passwords don't match")
        if (!token) return toast.warn('No token provided')

        //Password must contain only english letters and numbers, numbers, and be at least 8 characters long
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
        if (!passwordRegex.test(password)) return toast.warn('Password must contain only english letters and numbers, and be at least 8 characters long')

        try {
            setIsLoading(true)
            await userService.resetPasswordConfirm(token, password)
            toast.success('Password has been reset successfully')
            setIsLoading(false)
            navigate('/auth/')
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="m-auto my-20 w-1/2 ">
            <h4 className="text-center font-bold text-primary text-xl mt-2 mb-4 tracking-wider">Reset Password</h4>
            <form onSubmit={handleSubmit} className="bg-slate-100 flex flex-col p-8 gap-y-4 shadow-xl rounded-lg" id="reset-pass-form">
                <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New Password" required />
                <input className="auth-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" required />
                <Button
                    disabled={isLoading}
                    className="bg-primary transition-colors text-white duration-300 max-h-[40px] rounded-md p-2 my-2 disabled:cursor-not-allowed hover:bg-primary/90"
                    type="submit">Reset Password
                </Button>
            </form>

            <div className="flex items-center justify-center gap-x-2 mt-8">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
                    <FaUserAlt className="text-xl" />
                </div>
                <div className="flex flex-col">
                    <h4 className="text-lg font-bold text-primary">Rolling</h4>
                    <Link to={'https://github.com/oferGavrilov/Rolling-chat-messenger'} target="_blank" className="text-sm text-slate-400">@rolling</Link>
                </div>
            </div>

        </div>
    )
}

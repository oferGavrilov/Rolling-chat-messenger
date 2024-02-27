import nodemailer from 'nodemailer'
import { User } from '../models/user.model.js'
import crypto from 'crypto'

export class EmailService {
    private transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    private async sendEmail(to: string, subject: string, html: string): Promise<void> {
        try {
            const mailOptions = {
                from: process.env.EMAIL,
                to: to,
                subject: subject,
                html: html
            }

            await this.transporter.sendMail(mailOptions)
            console.log(`Email sent successfully to ${to}`)
        } catch (error) {
            console.error('Error sending email:', error)
            throw error
        }
    }

    async sendResetPasswordMail(email: string): Promise<void> {
        try {
            const user = await User.findOne({ email: email.trim() })
            if (!user) throw new Error('User not found')

            const resetToken = crypto.randomBytes(20).toString('hex')
            user.resetPasswordToken = resetToken
            user.resetPasswordExpires = new Date(Date.now() + 3600000) // 1 hour from now

            await user.save()

            const resetLink = process.env.NODE_ENV === 'development'
                ? `http://localhost:3000/reset-password/${resetToken}`
                : `https://www.rolling-chat.com/reset-password/${resetToken}`

            const html = this.getResetPasswordHtml(resetLink)

            await this.sendEmail(email, 'Reset Password', html)
        } catch (error) {
            console.error('Error sending reset password email:', error)
            throw error
        }
    }

    async sendErrorEmail( errorMessage: string): Promise<void> {
        const to = process.env.EMAIL
        const subject = 'Error Notification'
        const htmlContent = this.getErrorEmailHtml(errorMessage)
        await this.sendEmail(to, subject, htmlContent)
    }

    private getErrorEmailHtml(errorMessage: string): string {
        return `
            <div style="font-family: Arial, sans-serif background-color: #fff margin: 30px auto padding: 20px max-width: 600px border-radius: 8px box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) color: #333">
                <h1 style="color: #d32f2f">Error Notification</h1>
                <p style="font-size: 16px line-height: 1.6">${errorMessage}</p>
                <p style="margin-top: 20px text-align: center font-size: 14px color: #777">This is an automated message, please do not reply.</p>
            </div>
        `
    }
    
    private getResetPasswordHtml(resetLink: string): string {
        return `
            <div style="font-family: Arial, sans-serif color: #333333 text-align: center padding: 20px">
                <h1 style="color: #333333">Reset Your Password</h1>
                <p style="font-size: 16px">You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <a href="${resetLink}" style="background-color: #0099ff color: white padding: 14px 20px text-align: center text-decoration: none display: inline-block font-size: 16px margin: 4px 2px cursor: pointer border-radius: 8px">Reset Password</a>
                <p style="font-size: 14px">If you did not request this, please ignore this email and your password will remain unchanged.</p>
            </div>
        `
    }
}

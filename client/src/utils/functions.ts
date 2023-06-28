import { IMessage } from "../model/message.model"

export const isSameSenderMargin = (messages: IMessage[], m: IMessage, i: number, userId: string) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return false
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return false
  else return true
}

export function debounce<T extends (...args: unknown[]) => void> (
  func: T,
  timeout = 700
) {
  let timer: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function isSameSender (messages: IMessage[], m: IMessage, i: number, userId: string) {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  )
}

export function isLastMessage (messages: IMessage[], i: number, userId: string) {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  )
}

export function formatTime (timestamp: string) {
  const date = new Date(timestamp)
  const now = new Date()

  const diffMilliseconds = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMilliseconds / 60000)

  if (diffMinutes < 1) {
    return 'now'
  }

  if (date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
    return 'yesterday'
  }

  const formattedDate = `${date.getDate()}.${date.getMonth() + 1}`
  return formattedDate
}

export function formatDate (timestamp: string) {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}


export function startTypingTimeout (callback: () => void, delay: number): number {
  return setTimeout(callback, delay)
}

export function clearTypingTimeout (timeoutId: number): void {
  clearTimeout(timeoutId)
}
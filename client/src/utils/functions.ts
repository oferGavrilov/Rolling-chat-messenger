import { IMessage } from "../model/message.model"

export function isSameSenderMargin(messages: IMessage[], m: IMessage, i: number, userId: string): boolean {
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

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  timeout = 700
) {
  let timer: ReturnType<typeof setTimeout>

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let lastFunc: number;
  let lastRan: number;

  return function(this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (!lastRan) {
          func.apply(this, args);
          lastRan = Date.now();
      } else {
          clearTimeout(lastFunc);
          lastFunc = window.setTimeout(() => {
              if ((Date.now() - lastRan) >= limit) {
                  func.apply(this, args);
                  lastRan = Date.now();
              }
          }, Math.max(limit - (Date.now() - lastRan), 0));
      }
  } as T;
}


export function isSameSender(messages: IMessage[], m: IMessage, i: number, userId: string): boolean {
  if (!messages.length || !m || !m.sender || i >= messages.length - 1) return false;

  const nextMessage = messages[i + 1]
  if (!nextMessage || !nextMessage.sender) return false;

  return (
    nextMessage.sender._id !== m.sender._id &&
    m.sender._id !== userId
  );
}

export function isLastMessageFromUser(messages: IMessage[], currentMessageIndex: number, userId: string): boolean {
  for (let i = currentMessageIndex + 1; i < messages.length; i++) {
    if (messages[i].sender._id === userId) {
      return false
    }
  }
  return true
}


export function formatTime(timestamp: string): string {
  if (!timestamp) return ''

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

export function formatDate(timestamp: string): string {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export function formatLastSeenDate(timestamp: string): string {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()

  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))

  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffHours >= 24 && diffHours < 48) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  } else {
    return `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }
}

export function formatMessageSentDate(timestamp: string): string {
  if (!timestamp) return ''

  const sentDate = new Date(timestamp)
  const currentDate = new Date()

  if (
    sentDate.getDate() === currentDate.getDate() &&
    sentDate.getMonth() === currentDate.getMonth() &&
    sentDate.getFullYear() === currentDate.getFullYear()
  ) {
    return 'Today'
  } else if (
    sentDate.getDate() === currentDate.getDate() - 1 &&
    sentDate.getMonth() === currentDate.getMonth() &&
    sentDate.getFullYear() === currentDate.getFullYear()
  ) {
    return 'Yesterday'
  } else {
    const day = sentDate.getDate().toString().padStart(2, '0')
    const month = (sentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = sentDate.getFullYear()
    return `${day}/${month}/${year}`
  }
}


export function hasDayPassed(timestamp1: string, timestamp2: string): boolean {
  if (!timestamp1 || !timestamp2) {
    return false // If any of the timestamps is missing, consider day not passed
  }

  const date1 = new Date(timestamp1)
  const date2 = new Date(timestamp2)

  return (
    date1.getDate() !== date2.getDate() ||
    date1.getMonth() !== date2.getMonth() ||
    date1.getFullYear() !== date2.getFullYear()
  )
}

export function formatRecordTimer(timeInMilliseconds: number): string {
  if (timeInMilliseconds === 0) return '00:00'

  const totalSeconds = Math.floor(timeInMilliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function startTypingTimeout(callback: () => void, delay: number): NodeJS.Timeout {
  return setTimeout(callback, delay)
}

export function clearTypingTimeout(timeoutId: number): void {
  clearTimeout(timeoutId)
}

export function scrollToBottom(chatRef: React.RefObject<HTMLElement>): void {
  setTimeout(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, 0)
}

export async function onDownloadFile(selectedFile: IMessage) {
  if (!selectedFile.fileUrl) {
    console.error('File URL is not available.')
    return
  }
  const fileUrl = selectedFile.fileUrl

  try {
    const response = await fetch(fileUrl)
    if (!response.ok) throw new Error('Failed to download the file.')

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = selectedFile.fileName || 'downloaded-file'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(blobUrl)
    document.body.removeChild(a)
  } catch (error) {
    console.error('Error downloading the image:', error)
  }
}

export function formatBytesToKB(bytes: number): string {
  return (bytes / 1024).toFixed(1)
}
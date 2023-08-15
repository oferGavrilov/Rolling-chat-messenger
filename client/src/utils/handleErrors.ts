import { AxiosError } from "axios"

export function handleAxiosError (error: AxiosError): void {
      if (error.response) {
            console.log('Response Error:')
            console.log('Status:', error.response.status)
            console.log('Data:', error.response.data)
            console.log('Headers:', error.response.headers)
      } else if (error.request) {
            console.log("Request:", error.request)
      } else {
            console.log("Error:", error.message)
      }
      console.log("Error config:", error.config)
      console.log("Error Status:", error.status)
}

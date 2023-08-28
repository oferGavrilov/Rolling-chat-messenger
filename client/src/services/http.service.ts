import axios from 'axios'
import { getAuthConfig } from '../utils/authConfig'
import { toast } from 'react-toastify'

const env = import.meta.env.VITE_NODE_ENV

const BASE_URL =
      env === 'production'
            ? 'https://rolling-chat-messenger-server.vercel.app'
            : 'http://localhost:5000'

const axiosInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
})

export const httpService = {
      async get (endpoint: string, params = {}) {
            return ajax(endpoint, 'GET', null, params)
      },
      async post (endpoint: string, data: unknown) {
            return ajax(endpoint, 'POST', data)
      },
      async put (endpoint: string, data: unknown) {
            return ajax(endpoint, 'PUT', data)
      },
      async delete (endpoint: string, data: unknown) {
            return ajax(endpoint, 'DELETE', data)
      },
}

async function ajax (endpoint: string, method: string = 'GET', data: unknown = null, params: unknown = {}): Promise<unknown> {
      try {
            const config = getAuthConfig()

            const res = await axiosInstance({
                  url: endpoint,
                  method,
                  data,
                  params: method === 'GET' ? params : null,
                  headers: config.headers,
            })
            return res.data
      } catch (err: any) {
            console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
            console.dir(err)
            if (err.response) {
                  const status = err.response.status
                  if (status === 401) {
                        sessionStorage.clear()
                  } else if (status === 403) {
                        toast.warn('You are not allowed to do that.')
                  } else if (status === 404) {
                        toast.warn('Something went wrong, Try again later.')
                  } else if (status === 500) {
                        window.location.assign('/')
                  }
            }

            throw err
      }
}

import axios, { AxiosResponse } from 'axios'
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
      async get<T> (endpoint: string, params = {}): Promise<T> {
            return ajax(endpoint, 'GET', null, params)
      },
      async post<T> (endpoint: string, data: unknown): Promise<T> {
            return <T>ajax(endpoint, 'POST', data)
      },
      async put<T> (endpoint: string, data: unknown): Promise<T> {
            return ajax(endpoint, 'PUT', data)
      },
      async delete<T> (endpoint: string, data: unknown): Promise<T> {
            return ajax(endpoint, 'DELETE', data)
      },
}

async function ajax<T> (endpoint: string, method: string = 'GET', data: unknown = null, params: unknown = {}): Promise<T> {
      try {
            const config = getAuthConfig()

            const res: AxiosResponse<T> = await axiosInstance({
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

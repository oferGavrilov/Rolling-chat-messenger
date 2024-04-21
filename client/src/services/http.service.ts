import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { userService } from './user.service'
import socketService from './socket.service'
// import { userService } from './user.service'

const env = import.meta.env.VITE_NODE_ENV

const BASE_URL =
      env === 'production'
            ? env.VITE_SERVER_URL
            : env.VITE_LOCAL_SERVER_URL


axios.defaults.withCredentials = true
const axiosInstance = axios.create({
      baseURL: BASE_URL,
      withCredentials: true
})

interface ServiceResponse<T> {
      success: boolean
      message: string
      responseObject: T
      statusCode: number
}

export const httpService = {
      async get<T>(endpoint: string, params = {}): Promise<T> {
            return ajax(endpoint, 'GET', null, params)
      },
      async post<T>(endpoint: string, data: unknown, config?: {}): Promise<T> {
            return ajax(endpoint, 'POST', data, null, config)
      },
      async put<T>(endpoint: string, data: unknown, config?: {}): Promise<T> {
            return ajax(endpoint, 'PUT', data, null, config)
      },
      async delete<T>(endpoint: string, data: unknown): Promise<T> {
            return ajax(endpoint, 'DELETE', data)
      },
}

async function ajax<T>(
      endpoint: string,
      method: string = 'GET',
      data: unknown = null,
      params: unknown = {},
      config: {} = {}
): Promise<T> {
      try {
            const res: AxiosResponse<ServiceResponse<T>> = await axiosInstance({
                  url: endpoint,
                  method,
                  data,
                  params: method === 'GET' ? params : null,
                  ...config
            })
            return res.data.responseObject
      } catch (err: any) {
            if (env === 'development') {
                  console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, message: ${err.message} with data: `, data)
                  console.dir(err)
            }
            console.log('err', err)
            console.log('status', err?.response?.status)
            console.log('message', err.response?.data.message)
            if (err.response) {
                  const status = err.response.status
                  const message = err?.response?.data?.message

                  switch (status) {
                        case 400:
                              throw message || 'Something went wrong, Try again later.'
                        case 409:
                              toast.warn(err.response.data.message || 'You are not allowed to do that.')
                              break
                        case 401:
                              if (err.response.data.message === 'expired') {
                                    await userService.logout()
                                    socketService.terminate();
                                    window.location.assign('/auth')
                              } else {
                                    toast.warn(err.response.data.message || 'You are not logged in.')
                              }
                              break
                        case 403:
                              toast.warn(err.response.data.message || 'You are not allowed to do that.')
                              break
                        case 404:
                              toast.warn(err.response.data.message || 'Something went wrong, Try again later.')
                              break
                        case 500:
                              env === 'production' && window.location.assign('/')
                              break
                  }
            }

            throw err
      }
}

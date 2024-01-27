import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'

const env = import.meta.env.VITE_NODE_ENV

const BASE_URL =
      env === 'production'
            ? env.VITE_SERVER_URL
            : env.VITE_LOCAL_SERVER_URL

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

            const res: AxiosResponse<T> = await axiosInstance({
                  url: endpoint,
                  method,
                  data,
                  params: method === 'GET' ? params : null,
            })
            return res.data
      } catch (err: any) {
            console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, message: ${err.message} with data: `, data)
            console.dir(err)
            console.log('status', err?.response?.status)
            console.log('err.response', err.response.data.message)
            if (err.response) {
                  const status = err.response.status
                  if (status === 401) {
                        try {
                              await refreshToken()

                              const res: AxiosResponse<T> = await axiosInstance({
                                    url: endpoint,
                                    method,
                                    data,
                                    params: method === 'GET' ? params : null,
                              })

                              return res.data
                        } catch (err) {
                              throw err
                        }
                  } else if (status === 403) {
                        toast.warn(err.response.data.message || 'You are not allowed to do that.')
                  } else if (status === 404) {
                        toast.warn('Something went wrong, Try again later.')
                  } else if (status === 500) {
                        // window.location.assign('/')
                  }
            }

            throw err
      }
}

async function refreshToken() {
      try {
          const response = await axiosInstance.post('/api/auth/refresh');
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return accessToken;
      } catch (error) {
          console.error('Error refreshing token', error);
          throw error;
      }
  }
  
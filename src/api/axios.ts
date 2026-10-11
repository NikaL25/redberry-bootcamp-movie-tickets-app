import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

import { API_BASE_URL } from './endpoints'

import {
  TOKEN_KEY,
  clearSession,
  handleUnauthorized,
  setReplay,
  type ReplayAction,
} from '@/features/auth/authSlice'

import { parseApiError } from '@/utils/errorHandling'

import type { store as AppStore } from '@/app/store'

type AuthRequestConfig = InternalAxiosRequestConfig & {
  authReplay?: ReplayAction
}

let storeRef: typeof AppStore | null = null

export function injectStore(store: typeof AppStore) {
  storeRef = store
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use((config) => {
  console.log('[API REQUEST]', {
    method: config.method?.toUpperCase(),
    baseURL: config.baseURL,
    url: config.url,
    fullURL: `${config.baseURL ?? ''}${config.url ?? ''}`,
  })

  const token =
    storeRef?.getState().auth.token ??
    (typeof window !== 'undefined'
      ? localStorage.getItem(TOKEN_KEY)
      : null)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

function isCredentialRequest(url: string): boolean {
  const normalizedUrl = url.toLowerCase()

  return (
    normalizedUrl.includes('/login') ||
    normalizedUrl.includes('/register')
  )
}

function getRequestReplay(
  config: AuthRequestConfig | undefined,
): ReplayAction {
  return config?.authReplay ?? null
}

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('[API RESPONSE]', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
    })

    return response
  },

  (error: AxiosError) => {
    const parsed = parseApiError(error)

    const config =
      error.config as AuthRequestConfig | undefined

    console.error('[API ERROR]', {
      method: config?.method?.toUpperCase(),
      baseURL: config?.baseURL,
      url: config?.url,
      status: parsed.status,
      message: parsed.message,
      responseData: error.response?.data,
      responseURL: error.response?.config.url,
      responseMethod: error.response?.config.method,
    })

    const url = config?.url ?? ''
    const isCredentialCall = isCredentialRequest(url)

    if (
      parsed.status === 401 &&
      !isCredentialCall &&
      storeRef
    ) {
      const state = storeRef.getState()

      let replay =
        getRequestReplay(config) ??
        state.auth.replay

      if (
        !replay &&
        state.booking?.isOpen &&
        state.booking.sessionId
      ) {
        replay = {
          type: 'book',
          sessionId: state.booking.sessionId,
        }
      }

      if (replay) {
        storeRef.dispatch(setReplay(replay))
      }

      storeRef.dispatch(clearSession())

      storeRef.dispatch(
        handleUnauthorized(
          replay ? { replay } : undefined,
        ),
      )
    }

    return Promise.reject(parsed)
  },
)
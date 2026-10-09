import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/models'

export const TOKEN_KEY = 'kinoxii_token'

export type AuthModalMode = 'closed' | 'login' | 'register'

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error'


export type ReplayAction =
  | {
      type: 'book'
      sessionId: number
    }
  | {
      type: 'notify'
      slug: string
    }
  | {
      type: 'profile'
    }
  | {
      type: 'tickets'
    }
  | {
      type: 'foyer-order'
    }
  | null

export type AuthState = {
  token: string | null
  user: User | null

  status: AuthStatus

  /**
   * Login / Register modal.
   */
  modal: AuthModalMode


  profileModal: boolean


  replay: ReplayAction

  errorMessage: string | null
}

function getInitialToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(TOKEN_KEY)
}

const initialState: AuthState = {
  token: getInitialToken(),
  user: null,
  status: 'idle',
  modal: 'closed',
  profileModal: false,
  replay: null,
  errorMessage: null,
}

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
  
    setCredentials(
      state,
      action: PayloadAction<{
        user: User
        token: string
      }>,
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.status = 'success'
      state.errorMessage = null

    
      state.modal = 'closed'
      state.profileModal = false

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          TOKEN_KEY,
          action.payload.token,
        )
      }
    },

    
    setUser(
      state,
      action: PayloadAction<User>,
    ) {
      state.user = action.payload
      state.status = 'success'
      state.errorMessage = null
    },

   
    setAuthStatus(
      state,
      action: PayloadAction<AuthStatus>,
    ) {
      state.status = action.payload
    },

 
    openAuthModal(
      state,
      action: PayloadAction<
        Exclude<AuthModalMode, 'closed'>
      >,
    ) {
      state.modal = action.payload
      state.profileModal = false
      state.errorMessage = null
      state.status = 'idle'
    },

 
    closeAuthModal(state) {
      state.modal = 'closed'
      state.errorMessage = null
      state.status = 'idle'
    },

    
    openProfileModal(state) {
      state.profileModal = true
      state.modal = 'closed'
      state.errorMessage = null
    },

   
    closeProfileModal(state) {
      state.profileModal = false
    },


    setReplay(
      state,
      action: PayloadAction<ReplayAction>,
    ) {
      state.replay = action.payload
    },

 
    clearReplay(state) {
      state.replay = null
    },

   
    setAuthError(
      state,
      action: PayloadAction<string | null>,
    ) {
      state.errorMessage = action.payload

      if (action.payload) {
        state.status = 'error'
      }
    },

    handleUnauthorized(
      state,
      action: PayloadAction<
        { replay?: ReplayAction } | undefined
      >,
    ) {
      state.modal = 'login'
      state.profileModal = false
      state.errorMessage = null
      state.status = 'idle'

      if (action.payload?.replay) {
        state.replay = action.payload.replay
      }
    },

   
    clearSession(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.modal = 'closed'
      state.profileModal = false
      state.errorMessage = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
      }

    },

 
    logout(state) {
      state.user = null
      state.token = null
      state.status = 'idle'
      state.modal = 'closed'
      state.profileModal = false
      state.replay = null
      state.errorMessage = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY)
      }
    },
  },
})

export const {
  setCredentials,
  setUser,
  setAuthStatus,
  openAuthModal,
  closeAuthModal,
  openProfileModal,
  closeProfileModal,
  setReplay,
  clearReplay,
  setAuthError,
  handleUnauthorized,
  clearSession,
  logout,
} = authSlice.actions

export default authSlice.reducer

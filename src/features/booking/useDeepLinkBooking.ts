import { useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'

import { useBookingFlow } from './useBookingFlow'

/**
 * Query params used to deep link straight into the seat picker:
 *
 *   /movies/:slug?session=123&date=2026-10-19
 */
const SESSION_PARAM = 'session'
const DATE_PARAM = 'date'

function toSessionId(value: string | null): number | null {
  if (!value) {
    return null
  }

  const id = Number(value)

  if (!Number.isInteger(id) || id <= 0) {
    return null
  }

  return id
}

type DeepLinkBookingOptions = {
  /**
   * Called once with the date that came with the deep link so the movie page
   * can pre-select the matching date in its date picker.
   */
  onDateLinked?: (date: string) => void
}

/**
 * Opens the booking flow for a session requested through the URL.
 *
 * Used by the sessions listing: clicking a session card navigates to the movie
 * page with `?session=<id>` and the seat picker opens automatically on top of
 * it. Authentication and profile completion are handled by the booking flow
 * (login / profile modals), which replays the booking afterwards.
 *
 * The params are consumed exactly once per session id and removed from the URL,
 * so closing the picker never re-opens it and the address bar stays clean.
 */
export function useDeepLinkBooking({ onDateLinked }: DeepLinkBookingOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { startBooking } = useBookingFlow()
  const { status } = useAuth()

  const handledSessionRef = useRef<number | null>(null)

  const sessionId = toSessionId(searchParams.get(SESSION_PARAM))
  const linkedDate = searchParams.get(DATE_PARAM)

  const clearDeepLinkParams = useCallback(() => {
    const next = new URLSearchParams(searchParams)

    next.delete(SESSION_PARAM)
    next.delete(DATE_PARAM)

    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (sessionId == null) {
      return
    }

    if (handledSessionRef.current === sessionId) {
      return
    }

    /*
     * Auth state is still being restored (a token exists but /me has not
     * answered yet). Booking now would treat a logged in user as a guest,
     * so wait for the next render instead of consuming the deep link.
     */
    if (status === 'loading') {
      return
    }

    handledSessionRef.current = sessionId

    if (linkedDate) {
      onDateLinked?.(linkedDate)
    }

    startBooking(sessionId)

    clearDeepLinkParams()
  }, [
    clearDeepLinkParams,
    linkedDate,
    onDateLinked,
    sessionId,
    startBooking,
    status,
  ])
}

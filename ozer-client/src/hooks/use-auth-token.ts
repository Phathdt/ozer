'use client'

import { useAuth } from '@clerk/nextjs'

export const useAuthToken = () => {
  const { getToken, isSignedIn } = useAuth()

  const getAuthToken = async () => {
    if (!isSignedIn) return null
    return getToken()
  }

  return {
    getAuthToken,
    isSignedIn,
  }
}

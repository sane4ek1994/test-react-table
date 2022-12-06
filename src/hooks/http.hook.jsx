import { useCallback, useState } from 'react'

export const useHttp = () => {
  const [process, setProcess] = useState('waiting')
  const [error, setError] = useState(null)

  const request = useCallback(
    async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {
      setProcess('loading')

      try {
        const response = await fetch(url, { method, body, headers })

        if (!response.ok) {
          throw new Error(`Could not fetch ${url} status: ${response.status}`)
        }

        const data = await response.json()

        // setProcess('confirmed')
        return data
      } catch (error) {
        setProcess('error')
        setError(error.message)
        throw error
      }
    },
    []
  )

  const clearError = useCallback(() => {
    setError(null)
    setProcess('loading')
  }, [])

  return { process, error, request, clearError, setProcess }
}

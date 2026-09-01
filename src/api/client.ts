const API_URL = import.meta.env.VITE_API_URL

export function getApiUrl(path: string) {
  return `${API_URL}${path}`
}

type ValidationError = {
  loc?: Array<string | number>
  msg?: string
}

type ApiErrorResponse = {
  detail?: string | ValidationError[]
}

export async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorResponse

    if (typeof data.detail === 'string') {
      return data.detail
    }

    if (Array.isArray(data.detail)) {
      const messages = data.detail
        .map((error) => {
          if (!error.msg) {
            return null
          }

          const field = error.loc?.at(-1)

          if (typeof field === 'string') {
            return `${field}: ${error.msg}`
          }

          return error.msg
        })
        .filter(Boolean)

      if (messages.length > 0) {
        return messages.join('. ')
      }
    }
  } catch {
    // Response did not contain JSON.
  }

  return fallbackMessage
}
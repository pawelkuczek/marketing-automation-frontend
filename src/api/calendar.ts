import { getApiUrl } from './client'

export type ProcessedCalendar = {
  blob: Blob
  filename: string
}

export async function processCalendar(
  file: File,
): Promise<ProcessedCalendar> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await fetch(
    getApiUrl('/excel/process-calendar'),
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    let message = 'Failed to process calendar.'

    try {
      const errorData = await response.json()

      if (errorData.detail) {
        message = errorData.detail
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message)
  }

  const blob = await response.blob()

  const contentDisposition = response.headers.get(
    'Content-Disposition',
  )

  const filenameMatch = contentDisposition?.match(
    /filename\*=utf-8''([^;]+)/i,
  )

  const filename = filenameMatch
    ? decodeURIComponent(filenameMatch[1])
    : `ai_processed_${file.name}`

  return {
    blob,
    filename,
  }
}
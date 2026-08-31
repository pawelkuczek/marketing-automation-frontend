import {
  getApiErrorMessage,
  getApiUrl,
} from './client'

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
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to process calendar.',
      ),
    )
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
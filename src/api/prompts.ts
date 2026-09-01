import {
  getApiErrorMessage,
  getApiUrl,
} from './client'

export type PromptResponse = {
  id: number
  name: string
  content: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CreatePromptRequest = {
  name: string
  content: string
}

export type UpdatePromptRequest = {
  name: string
  content: string
}

export async function getPrompts(): Promise<PromptResponse[]> {
  const response = await fetch(getApiUrl('/prompts'))

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to fetch prompts.',
      ),
    )
  }

  return response.json()
}

export async function createPrompt(
  prompt: CreatePromptRequest,
): Promise<PromptResponse> {
  const response = await fetch(getApiUrl('/prompts'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prompt),
  })

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to create prompt.',
      ),
    )
  }

  return response.json()
}

export async function updatePrompt(
  promptId: number,
  prompt: UpdatePromptRequest,
): Promise<PromptResponse> {
  const response = await fetch(getApiUrl(`/prompts/${promptId}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(prompt),
  })

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to save prompt.',
      ),
    )
  }

  return response.json()
}

export async function activatePrompt(
  promptId: number,
): Promise<PromptResponse> {
  const response = await fetch(
    getApiUrl(`/prompts/${promptId}/activate`),
    {
      method: 'PATCH',
    },
  )

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to activate prompt.',
      ),
    )
  }

  return response.json()
}

export async function deletePrompt(
  promptId: number,
): Promise<void> {
  const response = await fetch(
    getApiUrl(`/prompts/${promptId}`),
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        'Failed to delete prompt.',
      ),
    )
  }
}
import { getApiUrl } from './client'

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

export async function getPrompts(): Promise<PromptResponse[]> {
  const response = await fetch(getApiUrl('/prompts'))

  if (!response.ok) {
    throw new Error('Failed to fetch prompts')
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
    throw new Error('Failed to create prompt')
  }

  return response.json()
}
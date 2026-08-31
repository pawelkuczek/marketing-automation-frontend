import { describe, expect, it } from 'vitest'
import {
    getApiErrorMessage,
    getApiUrl,
} from './client'

describe('getApiUrl', () => {
    it('builds API URL from the configured base URL', () => {
        expect(getApiUrl('/prompts')).toContain('/prompts')
    })
})

describe('getApiErrorMessage', () => {
    it('returns backend detail when detail is a string', async () => {
        const response = new Response(
            JSON.stringify({
                detail: 'Active prompt cannot be deleted.',
            }),
            {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        const message = await getApiErrorMessage(
            response,
            'Fallback error.',
        )

        expect(message).toBe(
            'Active prompt cannot be deleted.',
        )
    })

    it('formats FastAPI validation errors', async () => {
        const response = new Response(
            JSON.stringify({
                detail: [
                    {
                        type: 'string_too_short',
                        loc: ['body', 'content'],
                        msg: 'String should have at least 10 characters',
                        input: 'test32',
                    },
                ],
            }),
            {
                status: 422,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )

        const message = await getApiErrorMessage(
            response,
            'Fallback error.',
        )

        expect(message).toBe(
            'content: String should have at least 10 characters',
        )
    })

    it('returns fallback when response is not valid JSON', async () => {
        const response = new Response(
            'Internal Server Error',
            {
                status: 500,
            },
        )

        const message = await getApiErrorMessage(
            response,
            'Failed to process request.',
        )

        expect(message).toBe(
            'Failed to process request.',
        )
    })
})
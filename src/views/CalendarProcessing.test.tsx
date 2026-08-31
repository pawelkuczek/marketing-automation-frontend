import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react'
import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import CalendarProcessing from './CalendarProcessing'

vi.mock('../api/calendar', () => ({
  processCalendar: vi.fn(),
}))

afterEach(() => {
  cleanup()
})

describe('CalendarProcessing', () => {
  it('disables processing when no file is selected', () => {
    render(<CalendarProcessing />)

    expect(
      screen.getByRole('button', {
        name: 'Process calendar',
      }),
    ).toBeDisabled()
  })

  it('accepts an xlsx file', () => {
    render(<CalendarProcessing />)

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(
      ['calendar'],
      'marketing-calendar.xlsx',
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    )

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    })

    expect(
      screen.getAllByText('marketing-calendar.xlsx'),
    ).toHaveLength(2)

    expect(
      screen.getByRole('button', {
        name: 'Process calendar',
      }),
    ).toBeEnabled()
  })

  it('rejects a file that is not xlsx', () => {
    render(<CalendarProcessing />)

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement

    const file = new File(
      ['calendar'],
      'marketing-calendar.csv',
      {
        type: 'text/csv',
      },
    )

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    })

    expect(
      screen.getByText('Only .xlsx files are supported.'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'Process calendar',
      }),
    ).toBeDisabled()
  })
})
# Marketing Automation Frontend

Frontend for a marketing automation application built with React, TypeScript, and Vite.

The application provides a simple interface for managing AI prompts and processing Excel marketing calendars through a separate FastAPI backend.

## Features

### Prompt Management

- display prompts from the backend
- create new prompts
- edit existing prompts
- activate a selected prompt
- delete inactive prompts
- display backend validation and API error messages

Only one prompt can be active at a time.

### Calendar Processing

- upload `.xlsx` marketing calendar files
- drag and drop support
- send files to the backend for AI processing
- display processing, success, and error states
- automatically download the processed Excel file

## Tech Stack

- React
- TypeScript
- Vite
- native Fetch API
- CSS
- Vitest
- React Testing Library

The frontend intentionally uses a small dependency set and does not include a global state management library or UI framework.

## Requirements

To run the application locally, you need:

- Node.js
- npm
- running Marketing Automation backend

The frontend expects the backend API to be available locally.

## Setup

Clone the repository and enter the project directory:

```bash
git clone https://github.com/pawelkuczek/marketing-automation-frontend.git
cd marketing-automation-frontend
```

Install dependencies:

```bash
npm install
```

Create a local `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Available Scripts

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm run test
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Backend Integration

The frontend communicates with a separate FastAPI backend using the native Fetch API.

Main API operations used by the application:

```text
GET    /prompts
POST   /prompts
PATCH  /prompts/{prompt_id}
PATCH  /prompts/{prompt_id}/activate
DELETE /prompts/{prompt_id}

POST   /excel/process-calendar
```

The Excel processing endpoint accepts an `.xlsx` file using `multipart/form-data` and returns the processed workbook as a downloadable Excel file.

## Error Handling

API errors are handled through a shared frontend error parser.

When FastAPI returns a `detail` message, the frontend displays the backend message to the user.

FastAPI validation errors are also parsed so that validation information can be presented in a readable form, for example:

```text
content: String should have at least 10 characters
```

If no useful backend error response is available, the frontend uses a fallback error message.

## Testing

The project includes lightweight frontend tests focused on important application behavior.

The tests cover:

- API URL and error handling
- FastAPI validation error parsing
- fallback API error handling
- calendar file selection
- `.xlsx` file validation
- disabled processing state when no file is selected

Tests are implemented with Vitest and React Testing Library.

Run them with:

```bash
npm run test
```

## Project Structure

```text
src/
├── api/
│   ├── calendar.ts
│   ├── client.ts
│   ├── client.test.ts
│   └── prompts.ts
├── components/
│   └── Sidebar.tsx
├── test/
│   └── setup.ts
├── views/
│   ├── CalendarProcessing.tsx
│   ├── CalendarProcessing.test.tsx
│   └── PromptManagement.tsx
├── App.css
├── App.tsx
└── main.tsx
```

> The exact test file layout may vary as the project evolves.

## Application Architecture

The application is intentionally kept simple.

It consists of two main views:

- **Prompt Management** — manages prompts stored by the backend
- **Calendar Processing** — uploads and processes Excel marketing calendars

Navigation between the views is handled locally in React without introducing a routing library because the MVP only contains two application screens.

API communication is separated into small modules inside `src/api/`, while view components are responsible for UI state such as loading, processing, selection, and error states.

## Related Backend

This repository contains only the frontend application.

Backend repository:

[marketing-automation-backend](https://github.com/pawelkuczek/marketing-automation-backend)

The backend contains the main business logic and is built with:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- OpenAI API
- OpenPyXL
- pytest
- Docker Compose

The backend processes uploaded marketing calendars, generates missing social media content using AI, manages prompts, and returns processed Excel files.
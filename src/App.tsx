import { useState } from 'react'
import './App.css'

type Prompt = {
  id: number
  name: string
  description: string
  content: string
  isActive: boolean
}

const initialPrompts: Prompt[] = [
  {
    id: 1,
    name: 'Social Media Post - Default',
    description: 'Default prompt for generating social media content.',
    content: `Jesteś doświadczonym social media copywriterem. Twoim zadaniem
jest stworzenie angażującego posta na social media na podstawie
podanych informacji.

Zasady:
- Używaj prostego i zrozumiałego języka
- Post powinien być angażujący i zachęcać do interakcji
- Dostosuj ton do charakteru marki
- Dodaj odpowiednie emoji
- Zakończ pytaniem lub wezwaniem do działania

Informacje:
{{content}}`,
    isActive: true,
  },
  {
    id: 2,
    name: 'Product Launch Campaign',
    description: 'Prompt for product launch announcements and campaigns.',
    content: `Create a social media post announcing a new product launch.

Keep the message clear, energetic and focused on the main benefit.`,
    isActive: false,
  },
  {
    id: 3,
    name: 'Engagement Post - Questions',
    description: 'Prompt for creating engaging question-based posts.',
    content: `Create an engaging social media post based around a question.

Encourage users to share their opinions in the comments.`,
    isActive: false,
  },
  {
    id: 4,
    name: 'Promotional Post - Limited Time',
    description: 'Prompt for limited time offers and promotions.',
    content: `Create a promotional social media post for a limited-time offer.

Make the urgency clear without sounding overly aggressive.`,
    isActive: false,
  },
  {
    id: 5,
    name: 'Educational Content',
    description: 'Prompt for educational and informative posts.',
    content: `Create an educational social media post.

Explain the topic clearly and keep the content useful and easy to understand.`,
    isActive: false,
  },
]

function App() {
  const [prompts, setPrompts] = useState(initialPrompts)
  const [selectedPromptId, setSelectedPromptId] = useState(1)
  const [editedName, setEditedName] = useState(initialPrompts[0].name)
  const [editedContent, setEditedContent] = useState(
    initialPrompts[0].content,
  )

  const selectedPrompt = prompts.find(
    (prompt) => prompt.id === selectedPromptId,
  )

  function handleSelectPrompt(prompt: Prompt) {
    setSelectedPromptId(prompt.id)
    setEditedName(prompt.name)
    setEditedContent(prompt.content)
  }

  function handleActivate(promptId: number) {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) => ({
        ...prompt,
        isActive: prompt.id === promptId,
      })),
    )
  }

  function handleSave() {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) =>
        prompt.id === selectedPromptId
          ? {
              ...prompt,
              name: editedName,
              content: editedContent,
            }
          : prompt,
      ),
    )
  }

  function handleDelete() {
    if (!selectedPrompt || selectedPrompt.isActive) {
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this prompt?',
    )

    if (!confirmed) {
      return
    }

    const updatedPrompts = prompts.filter(
      (prompt) => prompt.id !== selectedPrompt.id,
    )

    setPrompts(updatedPrompts)

    if (updatedPrompts.length > 0) {
      const nextPrompt = updatedPrompts[0]

      setSelectedPromptId(nextPrompt.id)
      setEditedName(nextPrompt.name)
      setEditedContent(nextPrompt.content)
    }
  }

  function handleNewPrompt() {
    const newPrompt: Prompt = {
      id: Date.now(),
      name: 'New prompt',
      description: '',
      content: '',
      isActive: true,
    }

    const updatedPrompts = prompts.map((prompt) => ({
      ...prompt,
      isActive: false,
    }))

    setPrompts([newPrompt, ...updatedPrompts])
    setSelectedPromptId(newPrompt.id)
    setEditedName(newPrompt.name)
    setEditedContent(newPrompt.content)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>

          <div>
            <div className="brand-title">Marketing</div>
            <div className="brand-title">Automation</div>
          </div>
        </div>

        <nav className="navigation">
          <button className="nav-item">
            Calendar Processing
          </button>

          <button className="nav-item nav-item-active">
            Prompt Management
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Prompts</h1>

            <p className="page-description">
              Manage your AI prompts and set the active one.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={handleNewPrompt}
          >
            + New prompt
          </button>
        </div>

        <div className="prompt-layout">
          <section className="prompt-list-card">
            <div className="prompt-list-header">
              <span>Prompt</span>
              <span>Status</span>
            </div>

            <div className="prompt-list">
              {prompts.map((prompt) => (
                <button
                  key={prompt.id}
                  className={
                    prompt.id === selectedPromptId
                      ? 'prompt-row prompt-row-selected'
                      : 'prompt-row'
                  }
                  onClick={() => handleSelectPrompt(prompt)}
                >
                  <div className="prompt-info">
                    <div className="prompt-name-row">
                      <span
                        className={
                          prompt.isActive
                            ? 'status-dot status-dot-active'
                            : 'status-dot'
                        }
                      />

                      <span className="prompt-name">
                        {prompt.name}
                      </span>

                      {prompt.isActive && (
                        <span className="active-badge">
                          Active
                        </span>
                      )}
                    </div>

                    <p>{prompt.description}</p>
                  </div>

                  <div className="prompt-status">
                    <label
                      className="switch"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="radio"
                        name="activePrompt"
                        checked={prompt.isActive}
                        onChange={() => handleActivate(prompt.id)}
                      />

                      <span className="switch-track">
                        <span className="switch-thumb" />
                      </span>
                    </label>

                    <span>
                      {prompt.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="prompt-editor-card">
            {selectedPrompt ? (
              <>
                <div className="editor-header">
                  <div>
                    <h2>Edit prompt</h2>
                    <p>
                      Edit the selected prompt without changing its
                      status.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="prompt-name">Name</label>

                  <input
                    id="prompt-name"
                    type="text"
                    value={editedName}
                    onChange={(event) =>
                      setEditedName(event.target.value)
                    }
                  />
                </div>

                <div className="form-group form-group-grow">
                  <label htmlFor="prompt-content">
                    Prompt content
                  </label>

                  <textarea
                    id="prompt-content"
                    value={editedContent}
                    onChange={(event) =>
                      setEditedContent(event.target.value)
                    }
                  />
                </div>

                <div className="editor-footer">
                  <button
                    className="secondary-button danger-button"
                    disabled={selectedPrompt.isActive}
                    onClick={handleDelete}
                  >
                    Delete
                  </button>

                  <button
                    className="primary-button"
                    onClick={handleSave}
                  >
                    Save changes
                  </button>
                </div>
              </>
            ) : (
              <p>No prompt selected.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
import { useEffect, useState } from 'react'
import './App.css'
import {
  createPrompt,
  getPrompts,
  type PromptResponse,
} from './api/prompts'

function App() {
  const [prompts, setPrompts] = useState<PromptResponse[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedPrompt = prompts.find(
    (prompt) => prompt.id === selectedPromptId,
  )

  useEffect(() => {
    async function loadPrompts() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getPrompts()

        setPrompts(data)

        if (data.length > 0) {
          const firstPrompt = data[0]

          setSelectedPromptId(firstPrompt.id)
          setEditedName(firstPrompt.name)
          setEditedContent(firstPrompt.content)
        }
      } catch {
        setError('Failed to load prompts.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPrompts()
  }, [])

  function handleSelectPrompt(prompt: PromptResponse) {
    setIsCreating(false)
    setSelectedPromptId(prompt.id)
    setEditedName(prompt.name)
    setEditedContent(prompt.content)
  }

  function handleActivate(promptId: number) {
    setPrompts((currentPrompts) =>
      currentPrompts.map((prompt) => ({
        ...prompt,
        is_active: prompt.id === promptId,
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
    if (!selectedPrompt || selectedPrompt.is_active) {
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
    } else {
      setSelectedPromptId(null)
      setEditedName('')
      setEditedContent('')
    }
  }

  function handleNewPrompt() {
    setIsCreating(true)
    setSelectedPromptId(null)
    setEditedName('')
    setEditedContent('')
  }

  async function handleCreate() {
    try {
      setError(null)

      const newPrompt = await createPrompt({
        name: editedName,
        content: editedContent,
      })

      setPrompts((currentPrompts) => [
        newPrompt,
        ...currentPrompts.map((prompt) => ({
          ...prompt,
          is_active: false,
        })),
      ])

      setSelectedPromptId(newPrompt.id)
      setEditedName(newPrompt.name)
      setEditedContent(newPrompt.content)
      setIsCreating(false)
    } catch {
      setError('Failed to create prompt.')
    }
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

        {isLoading ? (
          <p>Loading prompts...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="prompt-layout">
            <section className="prompt-list-card">
              <div className="prompt-list-header">
                <span>Prompt</span>
                <span>Status</span>
              </div>

              <div className="prompt-list">
                {prompts.length === 0 ? (
                  <p className="empty-state">
                    No prompts yet. Create your first prompt.
                  </p>
                ) : (
                  prompts.map((prompt) => (
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
                              prompt.is_active
                                ? 'status-dot status-dot-active'
                                : 'status-dot'
                            }
                          />

                          <span className="prompt-name">
                            {prompt.name}
                          </span>

                          {prompt.is_active && (
                            <span className="active-badge">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="prompt-status">
                        <label
                          className="switch"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <input
                            type="radio"
                            name="activePrompt"
                            checked={prompt.is_active}
                            onChange={() =>
                              handleActivate(prompt.id)
                            }
                          />

                          <span className="switch-track">
                            <span className="switch-thumb" />
                          </span>
                        </label>

                        <span>
                          {prompt.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="prompt-editor-card">
              {selectedPrompt || isCreating ? (
                <>
                  <div className="editor-header">
                    <div>
                      <h2>
                        {isCreating ? 'New prompt' : 'Edit prompt'}
                      </h2>

                      <p>
                        {isCreating
                          ? 'Create a new prompt.'
                          : 'Edit the selected prompt without changing its status.'}
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
                    {isCreating ? (
                      <>
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setIsCreating(false)
                            setEditedName('')
                            setEditedContent('')
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          className="primary-button"
                          onClick={handleCreate}
                          disabled={
                            !editedName.trim() ||
                            !editedContent.trim()
                          }
                        >
                          Create prompt
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="secondary-button danger-button"
                          disabled={selectedPrompt?.is_active}
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
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p>No prompt selected.</p>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
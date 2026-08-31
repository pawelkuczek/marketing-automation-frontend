import { useEffect, useState } from 'react'
import {
  activatePrompt,
  createPrompt,
  deletePrompt,
  getPrompts,
  updatePrompt,
  type PromptResponse,
} from '../api/prompts'

function PromptManagement() {
  const [prompts, setPrompts] = useState<PromptResponse[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null)

  const [editedName, setEditedName] = useState('')
  const [editedContent, setEditedContent] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [activatingPromptId, setActivatingPromptId] = useState<number | null>(
    null,
  )

  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const selectedPrompt = prompts.find(
    (prompt) => prompt.id === selectedPromptId,
  )

  function getErrorMessage(error: unknown, fallbackMessage: string) {
    if (error instanceof Error) {
      return error.message
    }

    return fallbackMessage
  }

  useEffect(() => {
    async function loadPrompts() {
      try {
        setIsLoading(true)
        setLoadError(null)

        const data = await getPrompts()

        setPrompts(data)

        if (data.length > 0) {
          const firstPrompt = data[0]

          setSelectedPromptId(firstPrompt.id)
          setEditedName(firstPrompt.name)
          setEditedContent(firstPrompt.content)
        }
      } catch (error) {
        setLoadError(
          getErrorMessage(error, 'Failed to load prompts.'),
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadPrompts()
  }, [])

  function handleSelectPrompt(prompt: PromptResponse) {
    setActionError(null)
    setIsCreating(false)

    setSelectedPromptId(prompt.id)
    setEditedName(prompt.name)
    setEditedContent(prompt.content)
  }

  async function handleActivate(promptId: number) {
    try {
      setActivatingPromptId(promptId)
      setActionError(null)

      const activatedPrompt = await activatePrompt(promptId)

      setPrompts((currentPrompts) =>
        currentPrompts.map((prompt) => ({
          ...prompt,
          is_active: prompt.id === activatedPrompt.id,
        })),
      )
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'Failed to activate prompt.'),
      )
    } finally {
      setActivatingPromptId(null)
    }
  }

  async function handleSave() {
    if (!selectedPrompt) {
      return
    }

    try {
      setIsSaving(true)
      setActionError(null)

      const updatedPrompt = await updatePrompt(selectedPrompt.id, {
        name: editedName,
        content: editedContent,
      })

      setPrompts((currentPrompts) =>
        currentPrompts.map((prompt) =>
          prompt.id === updatedPrompt.id ? updatedPrompt : prompt,
        ),
      )

      setEditedName(updatedPrompt.name)
      setEditedContent(updatedPrompt.content)
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'Failed to save prompt.'),
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete() {
    if (!selectedPrompt || selectedPrompt.is_active) {
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this prompt?',
    )

    if (!confirmed) {
      return
    }

    try {
      setIsDeleting(true)
      setActionError(null)

      await deletePrompt(selectedPrompt.id)

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
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'Failed to delete prompt.'),
      )
    } finally {
      setIsDeleting(false)
    }
  }

  function handleNewPrompt() {
    setActionError(null)
    setIsCreating(true)
    setSelectedPromptId(null)
    setEditedName('')
    setEditedContent('')
  }

  function handleCancelCreate() {
    setActionError(null)
    setIsCreating(false)

    if (prompts.length > 0) {
      const firstPrompt = prompts[0]

      setSelectedPromptId(firstPrompt.id)
      setEditedName(firstPrompt.name)
      setEditedContent(firstPrompt.content)
    } else {
      setSelectedPromptId(null)
      setEditedName('')
      setEditedContent('')
    }
  }

  async function handleCreate() {
    try {
      setIsCreatingPrompt(true)
      setActionError(null)

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
    } catch (error) {
      setActionError(
        getErrorMessage(error, 'Failed to create prompt.'),
      )
    } finally {
      setIsCreatingPrompt(false)
    }
  }

  if (isLoading) {
    return <p>Loading prompts...</p>
  }

  if (loadError) {
    return <p>{loadError}</p>
  }

  return (
    <>
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

      {actionError && (
        <p className="action-error">
          {actionError}
        </p>
      )}

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
                <div
                  key={prompt.id}
                  className={
                    prompt.id === selectedPromptId
                      ? 'prompt-row prompt-row-selected'
                      : 'prompt-row'
                  }
                >
                  <button
                    className="prompt-select-button"
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
                  </button>

                  <div className="prompt-status">
                    <label className="switch">
                      <input
                        type="radio"
                        name="activePrompt"
                        checked={prompt.is_active}
                        disabled={activatingPromptId !== null}
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
                </div>
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
                    {isCreating
                      ? 'New prompt'
                      : 'Prompt details'}
                  </h2>

                  <p>
                    {isCreating
                      ? 'Create a new prompt.'
                      : 'View and edit the selected prompt.'}
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="prompt-name">
                  Name
                </label>

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
                      onClick={handleCancelCreate}
                      disabled={isCreatingPrompt}
                    >
                      Cancel
                    </button>

                    <button
                      className="primary-button"
                      onClick={handleCreate}
                      disabled={
                        isCreatingPrompt ||
                        !editedName.trim() ||
                        !editedContent.trim()
                      }
                    >
                      {isCreatingPrompt
                        ? 'Creating...'
                        : 'Create prompt'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="secondary-button danger-button"
                      disabled={
                        selectedPrompt?.is_active ||
                        isDeleting
                      }
                      onClick={handleDelete}
                    >
                      {isDeleting
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>

                    <button
                      className="primary-button"
                      onClick={handleSave}
                      disabled={
                        isSaving ||
                        !editedName.trim() ||
                        !editedContent.trim()
                      }
                    >
                      {isSaving
                        ? 'Saving...'
                        : 'Save changes'}
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
    </>
  )
}

export default PromptManagement
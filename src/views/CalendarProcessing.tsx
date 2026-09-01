import { useRef, useState } from 'react'
import { processCalendar } from '../api/calendar'

function CalendarProcessing() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function selectFile(file: File) {
    setError(null)
    setSuccessMessage(null)

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setSelectedFile(null)
      setError('Only .xlsx files are supported.')
      return
    }

    setSelectedFile(file)
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0]

    if (file) {
      selectFile(file)
    }
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]

    if (file) {
      selectFile(file)
    }
  }

  async function handleProcess() {
    if (!selectedFile) {
      return
    }

    try {
      setIsProcessing(true)
      setError(null)
      setSuccessMessage(null)

      const processedCalendar = await processCalendar(selectedFile)

      const downloadUrl = URL.createObjectURL(
        processedCalendar.blob,
      )

      const downloadLink = document.createElement('a')

      downloadLink.href = downloadUrl
      downloadLink.download = processedCalendar.filename

      document.body.appendChild(downloadLink)
      downloadLink.click()
      downloadLink.remove()

      URL.revokeObjectURL(downloadUrl)

      setSuccessMessage(
        `Calendar processed successfully: ${processedCalendar.filename}`,
      )
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to process calendar.')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Calendar Processing</h1>

          <p className="page-description">
            Upload an Excel marketing calendar and process it with AI.
          </p>
        </div>
      </div>

      <section className="calendar-card">
        <div className="calendar-card-header">
          <h2>Upload calendar</h2>

          <p>
            Select or drop an .xlsx marketing calendar below.
          </p>
        </div>

        <div
          className={
            isDragging
              ? 'upload-area upload-area-dragging'
              : 'upload-area'
          }
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            XLSX
          </div>

          {selectedFile ? (
            <>
              <p className="upload-title">
                {selectedFile.name}
              </p>

              <p className="upload-description">
                File ready to process
              </p>
            </>
          ) : (
            <>
              <p className="upload-title">
                Drop your Excel file here
              </p>

              <p className="upload-description">
                or select a file from your computer
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
          />

          <button
            className="secondary-button"
            type="button"
            disabled={isProcessing}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? 'Choose another file' : 'Choose file'}
          </button>
        </div>

        {error && (
          <p className="action-error">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="action-success">
            {successMessage}
          </p>
        )}

        <div className="calendar-actions">
          <div className="selected-file-info">
            {selectedFile && (
              <>
                <span>Selected file</span>
                <strong>{selectedFile.name}</strong>
              </>
            )}
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={!selectedFile || isProcessing}
            onClick={handleProcess}
          >
            {isProcessing
              ? 'Processing...'
              : 'Process calendar'}
          </button>
        </div>
      </section>
    </>
  )
}

export default CalendarProcessing
import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import CalendarProcessing from './views/CalendarProcessing'
import PromptManagement from './views/PromptManagement'

type View = 'calendar' | 'prompts'

function App() {
  const [activeView, setActiveView] = useState<View>('prompts')

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onChangeView={setActiveView}
      />

      <main className="main-content">
        {activeView === 'calendar' ? (
          <CalendarProcessing />
        ) : (
          <PromptManagement />
        )}
      </main>
    </div>
  )
}

export default App
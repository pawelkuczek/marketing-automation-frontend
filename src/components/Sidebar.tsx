type View = 'calendar' | 'prompts'

type SidebarProps = {
  activeView: View
  onChangeView: (view: View) => void
}

function Sidebar({
  activeView,
  onChangeView,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">M</div>

        <div>
          <div className="brand-title">Marketing</div>
          <div className="brand-title">Automation</div>
        </div>
      </div>

      <nav className="navigation">
        <button
          className={
            activeView === 'calendar'
              ? 'nav-item nav-item-active'
              : 'nav-item'
          }
          onClick={() => onChangeView('calendar')}
        >
          Calendar Processing
        </button>

        <button
          className={
            activeView === 'prompts'
              ? 'nav-item nav-item-active'
              : 'nav-item'
          }
          onClick={() => onChangeView('prompts')}
        >
          Prompt Management
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar
import { useState } from 'react'
import ClientManager from './components/ClientManager'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('clientes')

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema Hotelero</h1>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          Gestión de Clientes
        </button>
        <button
          className={`nav-tab ${activeTab === 'habitaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('habitaciones')}
        >
          Gestión de Habitaciones
        </button>
        <button
          className={`nav-tab ${activeTab === 'servicios' ? 'active' : ''}`}
          onClick={() => setActiveTab('servicios')}
        >
          Gestión de Servicios
        </button>
      </nav>

      <main className="app-content">
        {activeTab === 'clientes' && <ClientManager />}
        {activeTab === 'habitaciones' && (
          <div className="placeholder">
            <h2>Gestión de Habitaciones - Próximamente</h2>
          </div>
        )}
        {activeTab === 'servicios' && (
          <div className="placeholder">
            <h2>Gestión de Servicios - Próximamente</h2>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

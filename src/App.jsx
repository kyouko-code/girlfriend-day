import { Routes, Route, Navigate } from 'react-router-dom'
import Creator from './pages/Creator.jsx'
import Gift from './pages/Gift.jsx'

function App() {
  return (
    <div className="scanlines relative min-h-screen">
      <Routes>
        <Route path="/" element={<Creator />} />
        <Route path="/gift" element={<Gift />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

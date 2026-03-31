import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login'
import App from './pages/app'
import './index.css'

function Root() {
  const [username, setUsername] = useState(null)

  if (!username) return <Login onLogin={setUsername} />
  return <App username={username} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)

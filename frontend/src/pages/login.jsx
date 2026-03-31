import { useState } from 'react'
import styles from './login.module.css'

export default function Login({ onLogin }) {
  const [input, setInput] = useState('')
  const [erro, setErro] = useState('')

  const handleSubmit = () => {
    if (!input.trim()) { setErro('Digite um nome de usuário'); return }
    onLogin(input.trim().toLowerCase().replace(/\s+/g, '_'))
  }

  return (
    <div className={styles.page}>

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🌊</div>
          <h1 className={styles.logoText}>
            mood<span>flow</span>
          </h1>
        </div>

        <div className={styles.form}>
          <label className={styles.label}>SEU USERNAME</label>
          <input
            className={`${styles.input} ${erro ? styles.inputError : ''}`}
            value={input}
            onChange={e => { setInput(e.target.value); setErro('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="ex: KaiqueMateus"
          />
          {erro && <p className={styles.erro}>{erro}</p>}
          <button className={styles.btn} onClick={handleSubmit}>
            Entrar →
          </button>
        </div>
      </div>
    </div>
  )
}
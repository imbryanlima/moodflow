import { useEffect, useRef } from 'react'
import styles from './chat.module.css'

export default function Chat({ friend, messages, currentTrack, onSend, onShareTrack, input, onInputChange }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, friend])

  return (
    <div className={styles.chat}>
      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.row} ${msg.from === 'me' ? styles.mine : styles.theirs}`}
          >
            {msg.from === 'them' && (
              <div
                className={styles.miniAvatar}
                style={{ background: `${friend.color}22`, borderColor: `${friend.color}33`, color: friend.color }}
              >
                {friend.avatar}
              </div>
            )}

            <div className={styles.bubble}>
              {msg.isTrack ? (
                <div className={`${styles.trackBubble} ${msg.from === 'me' ? styles.trackBubbleMine : ''}`}>
                  {msg.track?.album_image && (
                    <div className={styles.trackThumb} style={{ backgroundImage: `url(${msg.track.album_image})` }} />
                  )}
                  <div>
                    <p className={styles.trackLabel}>COMPARTILHOU</p>
                    <p className={styles.trackName}>{msg.track?.name}</p>
                    <p className={styles.trackArtist}>{msg.track?.artist_name}</p>
                  </div>
                </div>
              ) : (
                <p className={`${styles.text} ${msg.from === 'me' ? styles.textMine : styles.textTheirs}`}>
                  {msg.text}
                </p>
              )}
              <span className={`${styles.time} ${msg.from === 'me' ? styles.timeRight : ''}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputBar}>
        {currentTrack && (
          <button className={styles.shareBtn} onClick={onShareTrack} title="Compartilhar música atual">
            🎵
          </button>
        )}
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSend()}
            placeholder={`Mensagem para ${friend?.name}...`}
          />
        </div>
        <button className={styles.sendBtn} onClick={onSend}>➤</button>
      </div>
    </div>
  )
}
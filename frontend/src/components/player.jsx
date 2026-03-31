import styles from './player.module.css'

export default function Player({ track, playing, onToggle, onClose, progress, duration, onSeek, volume, onVolume }) {
  if (!track) return null

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    return `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`
  }

  const volumeIcon = volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'

  return (
    <div className={styles.player}>
      <div className={styles.left}>
        <div
          className={styles.cover}
          style={{ backgroundImage: track.album_image ? `url(${track.album_image})` : undefined }}
        >
          {!track.album_image && '🎵'}
        </div>
        <div className={styles.info}>
          <p className={styles.name}>{track.name}</p>
          <p className={styles.artist}>{track.artist_name}</p>
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.controls}>
          <button className={styles.btnPlay} onClick={onToggle}>
            {playing ? '⏸' : '▶'}
          </button>
          <button className={styles.btnClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.progressSection}>
          <span className={styles.time}>{formatTime(duration * progress / 100)}</span>
          <div className={styles.progressBar} onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            onSeek((e.clientX - rect.left) / rect.width)
          }}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.volumeIcon}>{volumeIcon}</span>
        <input
          className={styles.volumeSlider}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={e => onVolume(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}
import Bars from './bars'
import styles from './trackcard.module.css'

function formatDuration(secs) {
  if (!secs) return ''
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}

export default function TrackCard({ track, isPlaying, onPlay, compact = false }) {
  return (
    <div
      className={`${styles.card} ${isPlaying ? styles.active : ''} ${compact ? styles.compact : ''}`}
      onClick={() => onPlay(track)}
    >
      <div className={styles.cover} style={{ backgroundImage: track.album_image ? `url(${track.album_image})` : undefined }}>
        {!track.album_image && '🎵'}
        {isPlaying && (
          <div className={styles.overlay}>
            <Bars color="white" size={16} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>
          {track.artist_name}
          {track.album_name ? ` · ${track.album_name}` : ''}
        </p>
      </div>

      {formatDuration(track.duration) && (
        <span className={styles.duration}>{formatDuration(track.duration)}</span>
      )}
    </div>
  )
}

import Bars from './bars'
import { STATUS_COLOR } from '../mockdata'
import styles from './sidebar.module.css'

const TABS = [
  { id: 'chat',     label: 'Chat' },
  { id: 'discover', label: 'Buscar' },
  { id: 'friends',  label: 'Amigos' },
]

export default function Sidebar({ username, friends, messages, friendTracks, activeTab, onTabChange, activeFriend, onFriendSelect, showMobileChat, onMobileBack, currentTrack, searchQ, onSearchChange, tracks, loadingTracks, onPlay, playingId }) {

  const body = (
    <div className={styles.body}>
      {activeTab === 'chat' && (
        <>
          <p className={styles.sectionLabel}>AMIGOS</p>
          {friends.map(f => {
            const nowP = friendTracks[f.id]
            const lastMsg = (messages[f.id] || []).slice(-1)[0]
            const isActive = activeFriend?.id === f.id
            return (
              <div
                key={f.id}
                className={`${styles.friendRow} ${isActive ? styles.friendActive : ''}`}
                style={isActive ? { background: `${f.color}14`, borderColor: `${f.color}30` } : {}}
                onClick={() => onFriendSelect(f)}
              >
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar} style={{ background: `${f.color}22`, borderColor: `${f.color}33`, color: f.color }}>
                    {f.avatar}
                  </div>
                  <span className={styles.statusDot} style={{ background: STATUS_COLOR[f.status] }} />
                </div>
                <div className={styles.friendInfo}>
                  <div className={styles.friendTop}>
                    <span className={styles.friendName}>{f.name}</span>
                    {lastMsg && <span className={styles.msgTime}>{lastMsg.time}</span>}
                  </div>
                  <div className={styles.friendSub}>
                    {nowP ? (
                      <>
                        <Bars color={f.color} size={10} />
                        <span style={{ color: f.color }}>{nowP.nome}</span>
                      </>
                    ) : lastMsg ? (
                      <span>{lastMsg.text}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}

      {activeTab === 'discover' && (
        <>
          <p className={styles.sectionLabel}>DESCOBRIR</p>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              value={searchQ}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="buscar música..."
            />
            {searchQ && (
              <button className={styles.clearBtn} onClick={() => onSearchChange('')}>✕</button>
            )}
          </div>
          {loadingTracks ? (
            <p className={styles.loading}>carregando...</p>
          ) : (
            tracks.slice(0, 15).map(t => (
              <div
                key={t.id}
                className={`${styles.trackRow} ${playingId === t.id ? styles.trackActive : ''}`}
                onClick={() => onPlay(t)}
              >
                <div className={styles.trackCover} style={{ backgroundImage: t.album_image ? `url(${t.album_image})` : undefined }}>
                  {!t.album_image && '🎵'}
                  {playingId === t.id && (
                    <div className={styles.trackOverlay}><Bars color="white" size={12} /></div>
                  )}
                </div>
                <div className={styles.trackInfo}>
                  <p className={styles.trackName} style={playingId === t.id ? { color: 'var(--accent)' } : {}}>{t.name}</p>
                  <p className={styles.trackArtist}>{t.artist_name}</p>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {activeTab === 'friends' && (
        <>
          <p className={styles.sectionLabel}>ONLINE</p>
          {friends.filter(f => f.status !== 'offline').map(f => {
            const nowP = friendTracks[f.id]
            return (
              <div key={f.id} className={styles.friendCard} style={nowP ? { borderColor: `${f.color}33` } : {}}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar} style={{ background: `${f.color}22`, borderColor: `${f.color}33`, color: f.color }}>
                    {f.avatar}
                  </div>
                  <span className={styles.statusDot} style={{ background: STATUS_COLOR[f.status] }} />
                </div>
                <div className={styles.friendInfo}>
                  <span className={styles.friendName}>{f.name}</span>
                  {nowP ? (
                    <div className={styles.nowPlaying} style={{ background: `${f.color}10`, borderColor: `${f.color}22` }}>
                      <Bars color={f.color} size={11} />
                      <span style={{ color: f.color }}>{nowP.nome}</span>
                    </div>
                  ) : (
                    <span className={styles.nothingPlaying}> nada tocando</span>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🌊</div>
            <span className={styles.logoText}>mood<span>flow</span></span>
          </div>
          <div className={styles.tabs}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {body}

        <div className={styles.me}>
          <div className={styles.meAvatar}>{username[0]?.toUpperCase()}</div>
          <div className={styles.meInfo}>
            <p className={styles.meUsername}>@{username}</p>
            {currentTrack && (
              <div className={styles.meTrack}>
                <Bars color="var(--accent)" size={9} />
                <span>{currentTrack.name}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      <nav className={styles.bottomNav}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.bottomTab} ${activeTab === tab.id ? styles.bottomTabActive : ''}`}
            onClick={() => {
              if (tab.id === 'chat' && activeTab === 'chat' && showMobileChat) {
                onMobileBack()
              } else {
                onTabChange(tab.id)
              }
            }}
          >
            <span className={styles.bottomLabel}>
              {tab.id === 'chat' && activeTab === 'chat' && showMobileChat ? '← Voltar' : tab.label}
            </span>
          </button>
        ))}
      </nav>

      <div className={`${styles.panel} ${activeTab !== 'chat' || !showMobileChat ? styles.panelOpen : ''}`}>
        <div className={styles.panelMe}>
          <div className={styles.meAvatar}>{username[0]?.toUpperCase()}</div>
          <div className={styles.meInfo}>
            <p className={styles.meUsername}>@{username}</p>
            {currentTrack && (
              <div className={styles.meTrack}>
                <Bars color="var(--accent)" size={9} />
                <span>{currentTrack.name}</span>
              </div>
            )}
          </div>
        </div>
        {body}
      </div>
    </>
  )
}
import { useState, useEffect, useRef, useCallback } from 'react'
import Sidebar from '../components/sidebar'
import Chat from '../components/chat'
import TrackCard from '../components/trackcard'
import Player from '../components/player'
import Bars from '../components/bars'
import { fetchPopular, searchTracks, updateUserTrack, clearUserTrack, getFriendTrack } from '../api'
import { MOCK_FRIENDS, MOCK_MESSAGES, STATUS_COLOR } from '../mockdata'
import styles from './app.module.css'

export default function App({ username }) {
  const [friends] = useState(MOCK_FRIENDS)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [activeFriend, setActiveFriend] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [showMobileChat, setShowMobileChat] = useState(false)

  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [popularTracks, setPopularTracks] = useState([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [searchMode, setSearchMode] = useState(false)

  const [friendTracks, setFriendTracks] = useState({})
  const [chatInput, setChatInput] = useState('')

  const [currentTrack, setCurrentTrack] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    setLoadingTracks(true)
    fetchPopular()
      .then(t => { setPopularTracks(t); setLoadingTracks(false) })
      .catch(() => setLoadingTracks(false))
  }, [])

  useEffect(() => {
    const poll = async () => {
      const updates = {}
      for (const f of friends) {
        if (f.status !== 'offline') {
          const t = await getFriendTrack(f.handle)
          if (t) updates[f.id] = t
        }
      }
      setFriendTracks(prev => ({ ...prev, ...updates }))
    }
    poll()
    const interval = setInterval(poll, 10000)
    return () => clearInterval(interval)
  }, [friends])

  useEffect(() => {
    if (!searchQ.trim()) { setSearchMode(false); setSearchResults([]); return }
    const t = setTimeout(async () => {
      setLoadingTracks(true)
      setSearchMode(true)
      const r = await searchTracks(searchQ).catch(() => [])
      setSearchResults(r)
      setLoadingTracks(false)
    }, 500)
    return () => clearTimeout(t)
  }, [searchQ])

  const playTrack = useCallback((track) => {
    if (!track.audio) return

    if (currentTrack?.id === track.id) {
      if (playing) { audioRef.current.pause(); setPlaying(false) }
      else { audioRef.current.play(); setPlaying(true) }
      return
    }

    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    audioRef.current = new Audio(track.audio)
    audioRef.current.volume = volume
    audioRef.current.play().catch(() => {})
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current.duration)
    })
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
    })
    audioRef.current.addEventListener('ended', () => {
      setPlaying(false)
      setProgress(0)
      clearUserTrack(username)
    })
    setCurrentTrack(track)
    setPlaying(true)
    setProgress(0)
    updateUserTrack(username, track)
  }, [currentTrack, playing, username, volume])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const stopPlayer = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    setCurrentTrack(null)
    setPlaying(false)
    setProgress(0)
    setDuration(0)
    clearUserTrack(username)
  }

  const handleSeek = (ratio) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = ratio * duration
  }

  const handleVolume = (val) => {
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }

  const handleFriendSelect = (f) => {
    setActiveFriend(f)
    setShowMobileChat(true)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setShowMobileChat(false)
  }

  const sendMessage = () => {
    if (!chatInput.trim()) return
    const msg = {
      from: 'me',
      text: chatInput,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => ({ ...prev, [activeFriend.id]: [...(prev[activeFriend.id] || []), msg] }))
    setChatInput('')
  }

  const shareTrack = () => {
    if (!currentTrack) return
    const msg = {
      from: 'me',
      text: '',
      isTrack: true,
      track: currentTrack,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => ({ ...prev, [activeFriend.id]: [...(prev[activeFriend.id] || []), msg] }))
  }

  const displayTracks = searchMode ? searchResults : popularTracks

  return (
    <div className={styles.app}>
      <Sidebar
        username={username}
        friends={friends}
        messages={messages}
        friendTracks={friendTracks}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeFriend={activeFriend}
        onFriendSelect={handleFriendSelect}
        showMobileChat={showMobileChat}
        onMobileBack={() => setShowMobileChat(false)}
        currentTrack={currentTrack}
        searchQ={searchQ}
        onSearchChange={setSearchQ}
        tracks={displayTracks}
        loadingTracks={loadingTracks}
        onPlay={playTrack}
        playingId={playing ? currentTrack?.id : null}
      />

      <main className={`${styles.main} ${currentTrack ? styles.mainWithPlayer : ''}`}>
        <header className={styles.header}>
          {activeTab === 'chat' && activeFriend && (
            <>
              <div className={styles.friendAvatar} style={{ background: `${activeFriend.color}22`, borderColor: `${activeFriend.color}33`, color: activeFriend.color }}>
                {activeFriend.avatar}
              </div>
              <div>
                <p className={styles.friendName}>{activeFriend.name}</p>
                <div className={styles.friendSub}>
                  <span>@{activeFriend.handle}</span>
                  {friendTracks[activeFriend.id] && (
                    <>
                      <span className={styles.dot}>·</span>
                      <Bars color={activeFriend.color} size={11} />
                      <span style={{ color: activeFriend.color }}>{friendTracks[activeFriend.id].nome}</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          {activeTab === 'discover' && (
            <div>
              <p className={styles.friendName}>{searchMode ? `"${searchQ}"` : 'Populares'}</p>
            </div>
          )}
          {activeTab === 'friends' && (
            <div>
              <p className={styles.friendName}>Amigos</p>
            </div>
          )}
        </header>

        {activeTab === 'chat' && activeFriend && (
          <Chat
            friend={activeFriend}
            messages={messages[activeFriend?.id] || []}
            currentTrack={currentTrack}
            onSend={sendMessage}
            onShareTrack={shareTrack}
            input={chatInput}
            onInputChange={setChatInput}
          />
        )}

        {activeTab === 'discover' && (
          <div className={styles.grid}>
            {loadingTracks ? (
              <p className={styles.loading}>carregando músicas...</p>
            ) : displayTracks.length === 0 ? (
              <p className={styles.loading}>nenhum resultado para "{searchQ}"</p>
            ) : (
              displayTracks.map(t => (
                <TrackCard
                  key={t.id}
                  track={t}
                  isPlaying={playing && currentTrack?.id === t.id}
                  onPlay={playTrack}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className={styles.friendsGrid}>
            {friends.map(f => {
              const nowP = friendTracks[f.id]
              return (
                <div key={f.id} className={styles.friendCard} style={nowP ? { borderColor: `${f.color}33` } : {}}>
                  <div className={styles.friendCardTop}>
                    <div className={styles.bigAvatar} style={{ background: `${f.color}22`, borderColor: `${f.color}33`, color: f.color }}>
                      {f.avatar}
                      <span className={styles.statusDot} style={{ background: STATUS_COLOR[f.status] }} />
                    </div>
                    <div>
                      <p className={styles.friendCardName}>{f.name}</p>
                      <p className={styles.friendCardHandle}>@{f.handle}</p>
                    </div>
                    <button
                      className={styles.chatBtn}
                      style={{ background: `${f.color}18`, borderColor: `${f.color}30`, color: f.color }}
                      onClick={() => { setActiveFriend(f); setActiveTab('chat') }}
                    >
                      Chat
                    </button>
                  </div>
                  {nowP ? (
                    <div className={styles.nowPlaying} style={{ background: `${f.color}10`, borderColor: `${f.color}22` }}>
                      {nowP.capa && <div className={styles.nowCover} style={{ backgroundImage: `url(${nowP.capa})` }} />}
                      <div className={styles.nowInfo}>
                        <div className={styles.nowLabel}>
                          <Bars color={f.color} size={11} />
                          <span>OUVINDO</span>
                        </div>
                        <p style={{ color: f.color }}>{nowP.nome}</p>
                        <p className={styles.nowArtist}>{nowP.artista}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.nothingPlaying}>
                      {f.status === 'offline' ? 'offline' : 'nada tocando'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Player
        track={currentTrack}
        playing={playing}
        onToggle={togglePlay}
        onClose={stopPlayer}
        progress={progress}
        duration={duration}
        onSeek={handleSeek}
        volume={volume}
        onVolume={handleVolume}
      />
    </div>
  )
}
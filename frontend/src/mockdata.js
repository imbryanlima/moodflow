export const MOCK_FRIENDS = [
  { id: 1, name: 'Lucas',   handle: 'espida',    avatar: 'L', color: '#fb923c', status: 'online'  },
  { id: 2, name: 'Kaique', handle: 'kiqadm',  avatar: 'K', color: '#f59e0b', status: 'online'  },
  { id: 3, name: 'Victor',  handle: 'sant',  avatar: 'V', color: '#34d399', status: 'away'    },
  { id: 4, name: 'Riquelme', handle: 'riquecostas',    avatar: 'R', color: '#fb923c', status: 'offline' },
]

export const MOCK_MESSAGES = {
  1: [
    { from: 'them', text: 'cara, to ouvindo a mesma musica por horas', time: '21:14' },
    { from: 'me',   text: 'deixa eu ver oq vc tá ouvindo kkkk',       time: '21:15' },
    { from: 'them', text: 'sincroniza ai, parceiro',    time: '21:15' },
  ],
  2: [
    { from: 'them', text: 'da uma olhada na musica que estou ouvindo', time: '20:30' },
    { from: 'me',   text: 'ja vi no teu perfil, parece boa demais',   time: '20:31' },
  ],
  3: [
    { from: 'me',   text: 'me manda sua playlist, por favor',  time: '19:00' },
    { from: 'them', text: 'tô montando uma agora, espera',      time: '19:05' },
  ],
  4: [
    { from: 'them', text: 'oi sumido!',    time: 'Ontem' },
    { from: 'me',   text: 'oi! tava sem net', time: 'Ontem' },
  ],
}

export const STATUS_COLOR = {
  online:  '#34d399',
  away:    '#fbbf24',
  offline: '#4b5563',
}
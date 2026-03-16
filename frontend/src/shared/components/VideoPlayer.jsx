import { useRef, useEffect, useState, useCallback } from 'react'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

let ytApiPromise = null

function loadYouTubeApi() {
  if (ytApiPromise) return ytApiPromise
  if (window.YT && window.YT.Player) return Promise.resolve()
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
  })
  return ytApiPromise
}

function extractVideoId(videoUrl) {
  if (!videoUrl) return null
  const match = videoUrl.match(/(?:v=|\/)([\w-]{11})(?:[&?]|$)/)
  return match?.[1] ?? null
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: 640,
  },
  videoWrap: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', /* 16:9 */
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid var(--slogbaa-border)',
    background: '#000',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    marginTop: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: 10,
    background: 'var(--slogbaa-glass-bg)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid var(--slogbaa-glass-border)',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--slogbaa-text-muted)',
    marginRight: '0.25rem',
  },
  speedBtn: {
    padding: '0.3rem 0.55rem',
    borderRadius: 6,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    minWidth: 36,
    minHeight: 32,
    transition: 'background 0.15s, color 0.15s, border-color 0.15s',
  },
  speedBtnActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    borderColor: 'var(--slogbaa-blue)',
  },
  captionBtn: {
    marginLeft: 'auto',
    padding: '0.3rem 0.6rem',
    borderRadius: 6,
    border: '1px solid var(--slogbaa-border)',
    background: 'transparent',
    color: 'var(--slogbaa-text)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: 32,
    transition: 'background 0.15s, color 0.15s',
  },
  captionBtnActive: {
    background: 'var(--slogbaa-blue)',
    color: '#fff',
    borderColor: 'var(--slogbaa-blue)',
  },
}

export function VideoPlayer({ videoUrl, videoId: videoIdProp }) {
  const embedId = videoIdProp || extractVideoId(videoUrl)
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [activeSpeed, setActiveSpeed] = useState(1)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    if (!embedId) return
    let destroyed = false

    loadYouTubeApi().then(() => {
      if (destroyed) return
      const el = containerRef.current
      if (!el) return

      playerRef.current = new window.YT.Player(el, {
        videoId: embedId,
        playerVars: {
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => {
            if (!destroyed) setPlayerReady(true)
          },
        },
      })
    })

    return () => {
      destroyed = true
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy() } catch { /* ignore */ }
      }
      playerRef.current = null
      setPlayerReady(false)
      setActiveSpeed(1)
      setCaptionsOn(false)
    }
  }, [embedId])

  const handleSpeed = useCallback((speed) => {
    const player = playerRef.current
    if (player?.setPlaybackRate) {
      player.setPlaybackRate(speed)
      setActiveSpeed(speed)
    }
  }, [])

  const handleCaptions = useCallback(() => {
    const player = playerRef.current
    if (!player) return
    if (captionsOn) {
      player.unloadModule?.('captions')
      setCaptionsOn(false)
    } else {
      player.loadModule?.('captions')
      setCaptionsOn(true)
    }
  }, [captionsOn])

  if (!embedId) {
    return videoUrl ? (
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--slogbaa-blue)' }}>
        Watch video
      </a>
    ) : null
  }

  return (
    <div style={styles.container}>
      <div style={styles.videoWrap}>
        <div ref={containerRef} style={styles.iframe} />
      </div>
      <div style={styles.controls} role="toolbar" aria-label="Video controls">
        <span style={styles.label}>Speed:</span>
        {SPEEDS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => handleSpeed(speed)}
            disabled={!playerReady}
            style={{
              ...styles.speedBtn,
              ...(activeSpeed === speed ? styles.speedBtnActive : {}),
            }}
            aria-pressed={activeSpeed === speed}
            aria-label={`Playback speed ${speed}x`}
          >
            {speed}x
          </button>
        ))}
        <button
          type="button"
          onClick={handleCaptions}
          disabled={!playerReady}
          style={{
            ...styles.captionBtn,
            ...(captionsOn ? styles.captionBtnActive : {}),
          }}
          aria-pressed={captionsOn}
          aria-label={captionsOn ? 'Turn off captions' : 'Turn on captions'}
        >
          CC
        </button>
      </div>
    </div>
  )
}

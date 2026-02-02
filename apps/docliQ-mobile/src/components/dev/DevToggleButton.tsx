import { IconSettings, IconWifi, IconWifiOff } from '@tabler/icons-react'
import { useDevMode } from '../../contexts/DevModeContext'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export function DevToggleButton() {
  const { isDevMode, toggleDevMode, openDrawer } = useDevMode()
  const { isOnline } = useOnlineStatus()

  const handleClick = () => {
    if (isDevMode) {
      openDrawer()
    } else {
      toggleDevMode()
    }
  }

  const handleToggleOffline = () => {
    window.dispatchEvent(new Event(isOnline ? 'offline' : 'online'))
  }

  return (
    <>
      <div className="dev-toggle-container">
        <button
          onClick={handleClick}
          className={`dev-toggle-button ${isDevMode ? 'dev-active' : ''}`}
          aria-label={isDevMode ? 'Open dev specs' : 'Enable dev mode'}
          title={isDevMode ? 'Open dev specs' : 'Enable dev mode'}
        >
          <IconSettings size={18} />
          <span>DEV</span>
          {isDevMode && <span className="dev-active-dot" />}
        </button>
        <button
          onClick={handleToggleOffline}
          className={`dev-toggle-button dev-toggle-secondary ${isOnline ? '' : 'dev-offline'}`}
          aria-label={isOnline ? 'Go offline' : 'Go online'}
          title={isOnline ? 'Go offline' : 'Go online'}
        >
          {isOnline ? <IconWifiOff size={18} /> : <IconWifi size={18} />}
          <span>{isOnline ? 'OFFLINE' : 'ONLINE'}</span>
        </button>
      </div>

      <style>{`
        .dev-toggle-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dev-toggle-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
          color: white;
          border: none;
          border-radius: 20px;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow:
            0 4px 12px rgba(124, 58, 237, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .dev-toggle-secondary {
          background: linear-gradient(135deg, #334155 0%, #1f2937 100%);
          box-shadow:
            0 4px 12px rgba(15, 23, 42, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .dev-offline {
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
          box-shadow:
            0 4px 12px rgba(37, 99, 235, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset;
        }

        .dev-toggle-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 16px rgba(124, 58, 237, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        }

        .dev-toggle-secondary:hover {
          box-shadow:
            0 6px 16px rgba(15, 23, 42, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        }

        .dev-offline:hover {
          box-shadow:
            0 6px 16px rgba(37, 99, 235, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        }

        .dev-toggle-button:active {
          transform: translateY(0);
        }

        .dev-active-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.9);
          }
        }

        .dev-active {
          animation: buttonPulse 2s ease-in-out infinite;
        }

        @keyframes buttonPulse {
          0%, 100% {
            box-shadow:
              0 4px 12px rgba(124, 58, 237, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 0 0 0 rgba(124, 58, 237, 0.4);
          }
          50% {
            box-shadow:
              0 4px 12px rgba(124, 58, 237, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 0 0 8px rgba(124, 58, 237, 0);
          }
        }
      `}</style>
    </>
  )
}

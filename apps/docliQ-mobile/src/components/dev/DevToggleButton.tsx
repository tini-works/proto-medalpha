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

        <div className="dev-toggle-segment" role="group" aria-label="Network mode">
          <button
            type="button"
            onClick={() => isOnline || handleToggleOffline()}
            className={`dev-segment ${isOnline ? 'dev-segment-active' : ''}`}
            aria-pressed={isOnline}
            title="Go online"
          >
            <IconWifi size={16} />
            <span>ONLINE</span>
          </button>
          <button
            type="button"
            onClick={() => (!isOnline ? undefined : handleToggleOffline())}
            className={`dev-segment ${!isOnline ? 'dev-segment-active offline' : ''}`}
            aria-pressed={!isOnline}
            title="Go offline"
          >
            <IconWifiOff size={16} />
            <span>OFFLINE</span>
          </button>
        </div>
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

        .dev-toggle-segment {
          display: inline-flex;
          align-items: stretch;
          border-radius: 999px;
          background: #0f172a;
          padding: 4px;
          box-shadow:
            0 6px 18px rgba(15, 23, 42, 0.35),
            0 0 0 1px rgba(255, 255, 255, 0.08) inset;
        }

        .dev-segment {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border: none;
          background: transparent;
          color: #cbd5f5;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.4px;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .dev-segment-active {
          background: #f8fafc;
          color: #0f172a;
          box-shadow:
            0 3px 10px rgba(15, 23, 42, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.4) inset;
        }

        .dev-segment-active.offline {
          background: #e0f2fe;
          color: #0f172a;
        }

        .dev-toggle-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 16px rgba(124, 58, 237, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.2) inset;
        }

        .dev-toggle-segment:hover {
          box-shadow:
            0 8px 22px rgba(15, 23, 42, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.15) inset;
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

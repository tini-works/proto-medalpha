import { IconSettings } from '@tabler/icons-react'
import { useDevMode } from '../../contexts/DevModeContext'

export function DevToggleButton() {
  const { isDevMode, toggleDevMode, openDrawer } = useDevMode()

  const handleClick = () => {
    if (isDevMode) {
      openDrawer()
    } else {
      toggleDevMode()
    }
  }

  return (
    <>
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

      <style>{`
        .dev-toggle-button {
          position: fixed;
          bottom: 20px;
          left: 20px;
          z-index: 9999;
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

        .dev-toggle-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 6px 16px rgba(124, 58, 237, 0.5),
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

import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import { IconX, IconRoute, IconTarget, IconDatabase, IconFingerprint } from '@tabler/icons-react'
import { useDevMode } from '../../contexts/DevModeContext'
import type { BiometricSimulationTarget } from '../../contexts/DevModeContext'
import { getScreenMetadata } from '../../config/screenMetadata'
import { useAppState } from '../../state'
import { PATHS } from '../../routes/paths'

const BIOMETRIC_ROUTES = [PATHS.SETTINGS_BIOMETRICS, PATHS.AUTH_SIGN_IN] as const

function BiometricSimulationSection({
  pathname,
  onRequest,
}: {
  pathname: string
  onRequest: (type: 'success' | 'fail', target: BiometricSimulationTarget) => void
}) {
  if (pathname === PATHS.SETTINGS_BIOMETRICS) {
    return (
      <div className="specs-section">
        <div className="specs-section-header">
          <IconFingerprint size={14} />
          <span>Biometric simulation</span>
        </div>
        <div className="specs-simulation-block">
          <div className="specs-simulation-label">Settings screen</div>
          <div className="specs-simulation-buttons">
            <button
              type="button"
              className="specs-sim-btn specs-sim-success"
              onClick={() => onRequest('success', 'biometrics-settings')}
            >
              Simulate success
            </button>
            <button
              type="button"
              className="specs-sim-btn specs-sim-fail"
              onClick={() => onRequest('fail', 'biometrics-settings')}
            >
              Simulate fail
            </button>
          </div>
        </div>
        <div className="specs-simulation-block">
          <div className="specs-simulation-label">Allow modal</div>
          <div className="specs-simulation-buttons">
            <button
              type="button"
              className="specs-sim-btn specs-sim-success"
              onClick={() => onRequest('success', 'allow-modal')}
            >
              Simulate success
            </button>
            <button
              type="button"
              className="specs-sim-btn specs-sim-fail"
              onClick={() => onRequest('fail', 'allow-modal')}
            >
              Simulate fail
            </button>
          </div>
        </div>
      </div>
    )
  }
  if (pathname === PATHS.AUTH_SIGN_IN) {
    return (
      <div className="specs-section">
        <div className="specs-section-header">
          <IconFingerprint size={14} />
          <span>Biometric simulation</span>
        </div>
        <div className="specs-simulation-block">
          <div className="specs-simulation-label">Sign-in prompt</div>
          <div className="specs-simulation-buttons">
            <button
              type="button"
              className="specs-sim-btn specs-sim-success"
              onClick={() => onRequest('success', 'sign-in-prompt')}
            >
              Simulate success
            </button>
            <button
              type="button"
              className="specs-sim-btn specs-sim-fail"
              onClick={() => onRequest('fail', 'sign-in-prompt')}
            >
              Simulate fail
            </button>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function SpecsDrawer() {
  const {
    isDevMode,
    isDrawerOpen,
    closeDrawer,
    toggleDevMode,
    requestBiometricSimulation,
  } = useDevMode()
  const location = useLocation()
  const { state } = useAppState()

  if (!isDevMode || !isDrawerOpen) {
    return null
  }

  const metadata = getScreenMetadata(location.pathname)
  const customStates = metadata?.getStates?.(state) || {}

  const drawerContent = (
    <>
      {/* Floating panel - positioned to the right of device frame */}
      <div className="specs-panel">
        <div className="specs-header">
          <div className="specs-header-badge">
            {metadata?.name?.toUpperCase().replace(/\s+/g, '-').slice(0, 12) || 'SCREEN'}
          </div>
          <h2 className="specs-title">{metadata?.name || 'Unknown Screen'}</h2>
          <div className="specs-route">{location.pathname}</div>
          <button
            onClick={closeDrawer}
            className="specs-close-btn"
            aria-label="Close panel"
          >
            <IconX size={18} />
          </button>
        </div>

        <div className="specs-content">
          {/* Intention */}
          {metadata?.intention && (
            <>
              <div className="specs-section">
                <div className="specs-section-header">
                  <IconTarget size={14} />
                  <span>User Goal</span>
                </div>
                <p className="specs-text">{metadata.intention.userGoal}</p>
              </div>

              <div className="specs-section">
                <div className="specs-section-header">
                  <IconRoute size={14} />
                  <span>UX Purpose</span>
                </div>
                <p className="specs-text">{metadata.intention.uxPurpose}</p>
              </div>
            </>
          )}

          {/* Custom states */}
          {Object.keys(customStates).length > 0 && (
            <div className="specs-section">
              <div className="specs-section-header">
                <IconDatabase size={14} />
                <span>States</span>
              </div>
              <div className="specs-states">
                {Object.entries(customStates).map(([key, value]) => (
                  <div key={key} className="specs-state-item">
                    <span className="specs-state-key">{key}</span>
                    <span className="specs-state-value">
                      {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Biometric simulation (panel-only; no inline DEV buttons on screen) */}
          {BIOMETRIC_ROUTES.includes(location.pathname as (typeof BIOMETRIC_ROUTES)[number]) && (
            <BiometricSimulationSection
              pathname={location.pathname}
              onRequest={requestBiometricSimulation}
            />
          )}

          {/* No metadata warning */}
          {!metadata && (
            <div className="specs-warning">
              No metadata defined for this route.
              <br />
              <code>src/config/screenMetadata.ts</code>
            </div>
          )}
        </div>

        <div className="specs-footer">
          <button onClick={toggleDevMode} className="specs-exit-btn">
            Exit Dev Mode
          </button>
        </div>
      </div>

      <style>{`
        .specs-panel {
          position: fixed;
          bottom: 80px;
          left: 20px;
          width: 320px;
          max-height: calc(100vh - 120px);
          background: #ffffff;
          border-radius: 16px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(0, 0, 0, 0.05);
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .specs-header {
          position: relative;
          padding: 20px 20px 16px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          border-radius: 16px 16px 0 0;
          color: white;
        }

        .specs-header-badge {
          display: inline-block;
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .specs-title {
          margin: 0 0 4px;
          font-size: 20px;
          font-weight: 700;
          color: white;
        }

        .specs-route {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          font-family: ui-monospace, monospace;
        }

        .specs-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .specs-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .specs-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .specs-section {
          margin-bottom: 20px;
        }

        .specs-section:last-child {
          margin-bottom: 0;
        }

        .specs-section-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
          color: #6b7280;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .specs-text {
          margin: 0;
          color: #1f2937;
          line-height: 1.5;
        }

        .specs-states {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .specs-state-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #f3f4f6;
          border-radius: 8px;
        }

        .specs-state-key {
          color: #6b7280;
          font-size: 13px;
        }

        .specs-state-value {
          color: #7c3aed;
          font-weight: 600;
          font-family: ui-monospace, monospace;
          font-size: 13px;
        }

        .specs-simulation-block {
          margin-bottom: 12px;
        }
        .specs-simulation-block:last-child {
          margin-bottom: 0;
        }
        .specs-simulation-label {
          color: #6b7280;
          font-size: 12px;
          margin-bottom: 6px;
        }
        .specs-simulation-buttons {
          display: flex;
          gap: 8px;
        }
        .specs-sim-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .specs-sim-success {
          background: #d1fae5;
          color: #065f46;
        }
        .specs-sim-success:hover {
          background: #a7f3d0;
        }
        .specs-sim-fail {
          background: #fee2e2;
          color: #991b1b;
        }
        .specs-sim-fail:hover {
          background: #fecaca;
        }

        .specs-warning {
          padding: 12px;
          background: #fef3c7;
          border-radius: 8px;
          color: #92400e;
          font-size: 13px;
          line-height: 1.5;
        }

        .specs-warning code {
          display: block;
          margin-top: 8px;
          color: #7c3aed;
          font-size: 11px;
        }

        .specs-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
        }

        .specs-exit-btn {
          width: 100%;
          padding: 10px 16px;
          background: #ede9fe;
          color: #6d28d9;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .specs-exit-btn:hover {
          background: #ddd6fe;
        }
      `}</style>
    </>
  )

  // Render via portal to escape the device frame's transform containment
  return createPortal(drawerContent, document.body)
}

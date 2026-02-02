import React from 'react'
import { useDevMode } from '../../contexts/DevModeContext'

interface DeviceFrameProps {
  children: React.ReactNode
}

export function DeviceFrame({ children }: DeviceFrameProps) {
  const { isDevMode } = useDevMode()

  if (!isDevMode) {
    return <>{children}</>
  }

  return (
    <div className="device-frame-wrapper">
      <div className="device-frame">
        {/* Top bezel with camera notch */}
        <div className="device-bezel-top">
          <div className="device-camera" />
        </div>

        {/* Screen content */}
        <div className="device-screen">
          {children}
        </div>

        {/* Bottom bezel */}
        <div className="device-bezel-bottom" />
      </div>

      <style>{`
        .device-frame-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .device-frame {
          position: relative;
          background: #1a1a1a;
          border-radius: 44px;
          padding: 12px;
          box-shadow:
            0 0 0 2px #333,
            0 0 0 4px #1a1a1a,
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .device-bezel-top {
          height: 32px;
          background: #1a1a1a;
          border-radius: 32px 32px 0 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        .device-camera {
          width: 80px;
          height: 24px;
          background: #0a0a0a;
          border-radius: 12px;
          position: relative;
        }

        .device-camera::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: #1a1a2e;
          border-radius: 50%;
          border: 2px solid #333;
        }

        .device-screen {
          width: 430px;
          height: 932px;
          background: #fff;
          border-radius: 32px;
          overflow: hidden;
          position: relative;
          /* Creates a new containing block for fixed-position children */
          /* This makes fixed elements position relative to device-screen, not viewport */
          transform: translateZ(0);
          /* Establish containing block for absolutely/fixed positioned descendants */
          contain: layout;
        }

        /* Override app-shell styles when inside device frame */
        .device-screen .app-shell {
          max-width: 100%;
          min-height: 100%;
          height: 100%;
          margin: 0;
          border-radius: 0;
          overflow-y: auto;
        }

        .device-bezel-bottom {
          height: 20px;
          background: #1a1a1a;
          border-radius: 0 0 32px 32px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .device-bezel-bottom::before {
          content: '';
          width: 120px;
          height: 5px;
          background: #333;
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

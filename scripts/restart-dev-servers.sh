#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LOG_DIR="${ROOT_DIR}/.dev-logs"
mkdir -p "$LOG_DIR"

PORTS=(5174 5190 5192 5195 5196 6006)

echo "Stopping any dev servers on ports: ${PORTS[*]}"
for port in "${PORTS[@]}"; do
  pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo " - Killing PID(s) on port ${port}: ${pids}"
    # shellcheck disable=SC2086
    kill -9 ${pids} 2>/dev/null || true
  fi
done

echo "Starting dev servers (logs in ${LOG_DIR})"

nohup pnpm dev:admin > "${LOG_DIR}/admin.log" 2>&1 & echo $! > "${LOG_DIR}/admin.pid"
nohup pnpm dev:appointment-v1 > "${LOG_DIR}/appointment-v1.log" 2>&1 & echo $! > "${LOG_DIR}/appointment-v1.pid"
nohup pnpm dev:n1 > "${LOG_DIR}/booking-n1.log" 2>&1 & echo $! > "${LOG_DIR}/booking-n1.pid"
nohup pnpm dev:n2 > "${LOG_DIR}/booking-n2.log" 2>&1 & echo $! > "${LOG_DIR}/booking-n2.pid"
nohup pnpm dev:n3 > "${LOG_DIR}/booking-n3.log" 2>&1 & echo $! > "${LOG_DIR}/booking-n3.pid"
nohup pnpm dev:design-system > "${LOG_DIR}/design-system.log" 2>&1 & echo $! > "${LOG_DIR}/design-system.pid"

echo "Done."
echo " - Admin:          http://localhost:5196/"
echo " - Appointment v1: http://localhost:5195/"
echo " - Booking N1:     http://localhost:5174/"
echo " - Booking N2:     http://localhost:5192/"
echo " - Booking N3:     http://localhost:5190/"
echo " - Storybook:      http://localhost:6006/"

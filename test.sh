#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Pick a random port in the ephemeral range
PORT=$(python3 -c "import random; print(random.randint(9100, 9999))")

# Start HTTP server in the background
python3 -m http.server "$PORT" &>/dev/null &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null" EXIT

# Wait for server to be ready
sleep 0.5

echo "HTTP server on port $PORT (pid $SERVER_PID)"
echo "Running visual test..."

node test-visual.mjs "$PORT"

echo ""
echo "Output files:"
echo "  /tmp/webslime-idle.png"
echo "  /tmp/webslime-dragging.png"
echo "  /tmp/webslime-console.log"

#!/bin/bash
cd /home/z/my-project
while true; do
  echo "Starting server at $(date)..."
  npx next start -p 3000 2>&1
  echo "Server died, restarting in 3s..."
  sleep 3
done

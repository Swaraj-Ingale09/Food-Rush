#!/bin/bash
export DANGEROUSLY_DISABLE_HOST_CHECK=true
export PORT=3000
export BROWSER=none
export CI=false
cd /home/user/foodrush-frontend
npx react-scripts start

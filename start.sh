#!/bin/bash

# Start backend and frontend
cd backend/ && . venv/bin/activate && flask run > /dev/null & pids=$!
cd ../frontend/ && . ~/.bashrc && npm start & pids+=" $!"

trap "kill $pids" SIGTERM SIGINT
wait $pids

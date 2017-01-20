#!/bin/bash

set -eux

PID=$(pgrep python3) || echo ""

if [[ $(echo $PID | wc -l) != 1 ]]; then
	echo "Mehre python3 Prozesse gefunden. Breche ab."
	exit 1
fi

if [[ "$PID" != "" ]]; then
	kill $PID
fi

nohup env PYTHONUNBUFFERED=1 python3 src/main.py </dev/null >server.log 2>&1 &

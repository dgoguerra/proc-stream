#!/usr/bin/env bash

# command to output some messages to stdout and stderr.
# sleep is used between echos to avoid stdout buffering

echo $'stdout message 1\nstdout message 2'
sleep 0.05
echo $'stderr message 1\nstderr message 2' >&2
sleep 0.05
echo "stdout message 3"
sleep 0.05
echo "stderr message 3" >&2
sleep 0.05
echo "stdout message 4"
sleep 0.05
echo "stdout message 5"
sleep 0.05

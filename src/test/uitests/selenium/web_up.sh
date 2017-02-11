#!/bin/bash
TEST=""
i=0
while [  "$TEST" != "200" -a $i -lt 50 ] ; do TEST=`curl -sL -w "%{http_code}" $1 -o /dev/null` ; echo "Return code: $TEST :: URL: $1"; sleep 5 ; let i=i+1; done
echo "Safety wait"
sleep 30;
#!/bin/bash
TEST=""
i=0
while [ -z "$TEST" -a $i -lt 20 ] ; do TEST=`curl http://$1/` ; sleep 5 ; let i=i+1; done
echo "Safety wait"
sleep 20;
#!/bin/bash

SIGNED=""
while [ -z "$SIGNED" ] ; do SIGNED=`curl -k -H "Accept: pson" https://puppetmaster.darkseer.org:8140/production/certificate_status/$1 | grep signed` ; echo checking DB - Exists:$1; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://puppetmaster.darkseer.org:8140/production/facts/$1 | grep ipaddress:` ; echo checking DB:$1 - intip; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://puppetmaster.darkseer.org:8140/production/facts/$1 | grep ec2_public_ipv4:` ; echo checking DB:$1 - extip; sleep 5; done


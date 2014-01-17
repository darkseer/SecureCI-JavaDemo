#!/bin/bash

SIGNED=""
while [ -z "$SIGNED" ] ; do SIGNED=`curl -k -H "Accept: pson" https://192.168.1.10:8140/production/certificate_status/$1 | grep signed` ; echo checking DB - Exists:$1; sleep 5; done
SIGNED=""
while [ -z "$SIGNED" ] ; do SIGNED=`curl -k -H "Accept: pson" https://192.168.1.10:8140/production/certificate_status/$2 | grep signed` ; echo checking WEB - Exist:$2; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://192.168.1.10:8140/production/facts/$2 | grep ipaddress:` ; echo checking WEB:$2 - intip; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://192.168.1.10:8140/production/facts/$2 | grep ec2_public_ipv4:` ; echo checking WEB:$2 - extip; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://192.168.1.10:8140/production/facts/$1 | grep ipaddress:` ; echo checking DB:$1 - intip; sleep 5; done
FACTS=""
while [ -z "$FACTS" ] ; do FACTS=`curl -k -H "Accept: yaml" https://192.168.1.10:8140/production/facts/$1 | grep ec2_public_ipv4:` ; echo checking DB:$1 - extip; sleep 5; done


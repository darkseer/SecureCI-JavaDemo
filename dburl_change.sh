#!/bin/bash
ip=`ifconfig eth0 | grep inet | grep -v inet6 | sed -e "s/ .*inet \([^ ]\+\).*/\1/g"`
port=`echo ${2} | sed -e "s/.*://g"`
cp env.properties.template ${1}
sed -i "s/__DBIP__/${ip}/g" ${1}
sed -i "s/__DBPORT__/${port}/g" ${1}

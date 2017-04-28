#!/bin/bash
ip=${3}
#port=`echo ${2} | sed -e "s/.*://g"`
cp env.properties.template ${1}
#sed -i "s/__DBIP__/${ip}/g" ${1}
#sed -i "s/__DBPORT__/${port}/g" ${1}

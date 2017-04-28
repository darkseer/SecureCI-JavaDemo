####################################################################################
# Interface to AWS DynamoDB.  Requires installation of AWS CLI
# for local testing.  Also need a programmatic Key from AWS IAM and CLI 
# configuration using `aws configure`.
#
# The table name data should be seeded into is set on the CLI.  On MS Window, it
# can be done like:
#
# set table_name=TICSEmployeeDEV
#
# Author: James Caple, 3/10/2017
# Requires Python >= v3
# Copyright (C) 2017, Dev Technology Group, Inc., All rights reserved
####################################################################################

import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime

####################################################################################
# Simple function to test connectivity with remote DynamoDB
####################################################################################
def printTableCreateTime():
	print(table.creation_date_time)

####################################################################################
# Insert array of data into DynamoDB
####################################################################################
def addJSONRecords(recs):
	print("Adding records to dynamoDB")
	try:
		with table.batch_writer() as batch:
			for rec in recs:
				batch.put_item( Item = rec )
	except Exception as e: 
		print(str(e))

####################################################################################
# Retrieve an item from DynamoDB
####################################################################################
def getItem(item_def):
	response = table.get_item(
		Key=item_def
	)
	return response['Item']

####################################################################################
# Takes a filter expression to return a set of data matching filter.
# e.g., Attr('username').eq('jcaple')
####################################################################################
def searchItems(AttrFilter):
	response = table.scan(
		FilterExpression=AttrFilter
	)
	items = response['Items']
	return items

TABLE_NAME = os.environ['table_name']

print("Seeding data into DynamoDB Table " + TABLE_NAME)

# Use Amazon DynamoDB
dynamodb = boto3.resource('dynamodb')

table = dynamodb.Table(TABLE_NAME)

employees = []

# 1
employee = {}
employee['username'] = 'jcaple'
employee['firstname'] = 'James'
employee['lastname'] = 'Caple'
employee['address1'] = '13511 Bell Drive'
employee['address2'] = 'n/a'
employee['city'] = 'San Antonio'
employee['state'] = 'TX'
employee['zip'] = '78217'
employee['phone'] = '5555555555'
today = datetime.now()
employee['last_login_time'] = today.strftime("%m/%d/%Y %H:%M:%S")
employee['last_update_time'] = today.strftime("%m/%d/%Y %H:%M:%S")
employees.append(employee)

# 2
employee2 = {}
employee2['username'] = 'cpolito'
employee2['firstname'] = 'Chris'
employee2['lastname'] = 'Polito'
employee2['address1'] = '1 Infinite Loop'
employee2['address2'] = 'n/a'
employee2['city'] = 'Cupertino'
employee2['state'] = 'CA'
employee2['zip'] = '95014'
employee2['phone'] = '5555555555'
today = datetime.now()
employee2['last_login_time'] = today.strftime("%m/%d/%Y %H:%M:%S")
employee2['last_update_time'] = today.strftime("%m/%d/%Y %H:%M:%S")
employees.append(employee2)

addJSONRecords(employees)

attrFilter = Attr('username').eq('cpolito')
print( searchItems(attrFilter) )
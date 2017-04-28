/*******************************************************************************
 * Lambda function example for TICS II technical demonstration.
 * Author: James Caple, 3/9/2017
 * Copyright (C) Dev Technology Group, Inc., All rights reserved
 ******************************************************************************/

var aws = require('aws-sdk');
var dynamodb = new aws.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    
    // Get ENV VAR defining Table Name
    var DB_TABLE_NAME = process.env.TABLE_NAME;

    console.log("Env Val for TABLE_NAME >>> " + DB_TABLE_NAME);
    console.log(JSON.stringify(event));

    if (event.operation) {
        var operation = event.operation;
        console.log("Servicing Op Request >>>> " + operation);

        event.payload.TableName = DB_TABLE_NAME;

        switch (operation) {
            case 'create':
                dynamodb.put(event.payload, callback);
                break;
            case 'read':
                dynamodb.get(event.payload, callback);
                break;
            case 'update':
                dynamodb.update(event.payload, callback);
                break;
            case 'delete':
                dynamodb.delete(event.payload, callback);
                break;
            case 'list':
                dynamodb.scan(event.payload, callback);
                break;
            case 'echo':
                callback(null, "Success");
                break;
            case 'ping':
                callback(null, "pong");
                break;
            default:
                callback('Unknown operation: ${operation}');
        }

    } else {

        var login = event.params.querystring.name;

        var params = {
            TableName: DB_TABLE_NAME
        };

        if (login != undefined) {
            params.FilterExpression = 'username = :login';
            params.ExpressionAttributeValues = {':login' : login};
        } 

        console.log("PARAMS >>> " + params);

        dynamodb.scan(params, function(err, data) {
            if (!err) {
                var employees = [];
                data.Items.forEach((item) => employees.push(item));
                
                context.done(
                    null,
                    JSON.stringify(employees)
                );
            } else {
                context.fail(err);
            }
        }); 
    } 
};
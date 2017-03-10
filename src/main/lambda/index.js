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
};
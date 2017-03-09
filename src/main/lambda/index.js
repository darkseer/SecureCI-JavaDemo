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

    console.log("Env Val for TABE_NAME >>> " + DB_TABLE_NAME);
    console.log(JSON.stringify(event));
    var whoIsCool = "James";
    
    try {
        whoIsCool = event.params.querystring.name;
        console.log("Name Query Param >> " + whoIsCool);
    } catch (e) {
        console.log("No name query param provided...Defaulting to the coolest.");
    }
    
    var output = { "message" : whoIsCool + " Is Cool" };

    console.log("Outputting JSON >>> " + JSON.stringify(output));

    try {
        context.done(null, output);
    } catch (e) {
        console.log("Error -> " + JSON.stringify(e));
        context.fail("An error occurred, holmes >> " + e);
    }
};
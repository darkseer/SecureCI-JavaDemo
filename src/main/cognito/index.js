
/*******************************************************************************
 * Example of how to use the AWS SDK to authenticate a user using AWS Cognito
 * User Pools.  Once the user is authenticated and the Identity JWT is 
 * retrieved, you can then use this token to access API Gateway Resources that
 * we define.
 *
 * To create a mega js file containing all dependencies using Webpack:
 *
 * npm run build
 *
 * To simply run from cli to debug:
 *
 * node index.js
 *
 * API Gateway Enpoint For Testing:
 *
 * https://4jhbs3q7mf.execute-api.us-east-1.amazonaws.com/Dev?name=Polito
 *
 * Author: James Caple, 3/9/2017
 * Copyright (C) Dev Technology Group, Inc., All rights reserved
 ******************************************************************************/

var TICSConfig = require('./config.js');	
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var AWS = require('aws-sdk');

console.log("ClientId >>> " + TICSConfig.TICSConfig.config.ClientId);
console.log("UserPoolId >>> " + TICSConfig.TICSConfig.config.UserPoolId);

var authenticationData = {
	Username : TICSConfig.TICSConfig.config.Username,
    Password : TICSConfig.TICSConfig.config.Password,
};

var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

var poolData = {
    UserPoolId : TICSConfig.TICSConfig.config.UserPoolId, // Your user pool id here
    ClientId : TICSConfig.TICSConfig.config.ClientId // Your client id here
};

var userPool = new CognitoUserPool(poolData);

var userData = {
    Username : TICSConfig.TICSConfig.config.Username,
    Pool : userPool
};

var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
        var accessToken = result.getAccessToken().getJwtToken();
        var userPoolARN = 'cognito-idp.' + TICSConfig.TICSConfig.config.region + '.amazonaws.com/'
        	+ TICSConfig.TICSConfig.config.identityPoolId;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId : TICSConfig.TICSConfig.config.identityPoolId, // your identity pool id here
            Logins : {
                // Change the key below according to the specific region your user pool is in.
                userPoolARN : result.getIdToken().getJwtToken()
            }
        });

        var identityToken = result.getIdToken().getJwtToken();

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();
        console.log("*** User is authenticated.  Allow them to use custom resources using Identity Token: " + identityToken);

        // In AJAX requests to an API Gateway Endpoint, put 'Authorization' key in Header with a value of this 
        // Identity Token (JWT)
    },

    onFailure: function(err) {
        console.log("ERROR >>> " + JSON.stringify(err));
    },

    newPasswordRequired: function(userAttributes, requiredAttributes) {
    	console.log("Inside newPasswordRequired");
    	console.log("Attributes >>> " + JSON.stringify(userAttributes));
    	userAttributes.email = TICSConfig.TICSConfig.config.Email;
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        // Get these details and call
        cognitoUser.completeNewPasswordChallenge(authenticationData.Password, userAttributes, this);
    }

});
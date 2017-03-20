import {Injectable, Inject} from '@angular/core';
import {environment} from '../../environments/environment';
import { Router } from '@angular/router';

/**
 * Created by Vladimir Budilov
 */

declare var AWSCognito: any;
declare var AWS: any;

export interface CognitoCallback {
    cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
    isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {

    public static _REGION = environment.region;

    public static _IDENTITY_POOL_ID = environment.identityPoolId;
    public static _USER_POOL_ID = environment.userPoolId;
    public static _CLIENT_ID = environment.clientId;

    public static _POOL_DATA = {
        UserPoolId: CognitoUtil._USER_POOL_ID,
        ClientId: CognitoUtil._CLIENT_ID
    };


    public static getAwsCognito(): any {
        return AWSCognito;
    }

    getUserPool() {
        return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoUtil._POOL_DATA);
    }

    getCurrentUser() {
        return this.getUserPool().getCurrentUser();
    }


    getCognitoIdentity(): string {
        return AWS.config.credentials.identityId;
    }

    getAccessToken(callback: Callback): void {
        if (callback == null) {
            throw('CognitoUtil: callback in getAccessToken is null...returning');
        }

        if (this.getCurrentUser() != null) {
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log('CognitoUtil: Cannot set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getAccessToken().getJwtToken());
                    }
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    getIdToken(callback: Callback): void {
        if (callback == null) {
            throw('CognitoUtil: callback in getIdToken is null...returning');
        }
        if (this.getCurrentUser() != null) {
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log('CognitoUtil: Cannot set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getIdToken().getJwtToken());
                    } else {
                        console.log("CognitoUtil: Got the id token, but the session isn't valid");
                    }
                }
            });
         } else {
            callback.callbackWithParam(null);
         }
    }

    getRefreshToken(callback: Callback): void {
        if (callback == null) {
            throw('CognitoUtil: callback in getRefreshToken is null...returning');
        }
        if (this.getCurrentUser() != null) {
            this.getCurrentUser().getSession(function (err, session) {
                if (err) {
                    console.log('CognitoUtil: Cannot set the credentials:' + err);
                    callback.callbackWithParam(null);
                } else {
                    if (session.isValid()) {
                        callback.callbackWithParam(session.getRefreshToken());
                    }
                }
            });
        } else {
            callback.callbackWithParam(null);
        }
    }

    refresh(): void {
        this.getCurrentUser().getSession(function (err, session) {
            if (err) {
                console.log('CognitoUtil: Cannot set the credentials:' + err);
            } else {
                if (session.isValid()) {
                    console.log('CognitoUtil: refreshed successfully');
                } else {
                    console.log('CognitoUtil: refreshed but session is still not valid');
                }
            }
        });
    }
}

@Injectable()
export class UserLoginService {

    constructor(public cognitoUtil: CognitoUtil, public router: Router) {
    }

    authenticate(username: string, password: string, callback: CognitoCallback) {
        console.log('UserLoginService: stgarting the authentication');

        // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
        AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

        const authenticationData = {
            Username: username,
            Password: password,
        };

        const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        console.log('UserLoginService: Params set...Authenticating the user');
        const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        console.log('UserLoginService: config is ' + JSON.stringify(AWS.config));
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {

                const logins = {};
                logins['cognito-idp.' + CognitoUtil._REGION + '.amazonaws.com/'
                    + CognitoUtil._USER_POOL_ID] = result.getIdToken().getJwtToken();

                // Add the User's Id Token to the Cognito credentials login map.
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID,
                    Logins: logins
                });

                console.log('UserLoginService: set the AWS credentials - ' + JSON.stringify(AWS.config.credentials));
                console.log('UserLoginService: set the AWSCognito credentials - ' + JSON.stringify(AWSCognito.config.credentials));
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
        });
    }

    forgotPassword(username: string, callback: CognitoCallback) {
        const userData = {
            Username: username,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.forgotPassword({
            onSuccess: function (result) {

            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            },
            inputVerificationCode() {
                callback.cognitoCallback(null, null);
            }
        });
    }

    confirmNewPassword(email: string, verificationCode: string, password: string, callback: CognitoCallback) {
        const userData = {
            Username: email,
            Pool: this.cognitoUtil.getUserPool()
        };

        const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: function (result) {
                callback.cognitoCallback(null, result);
            },
            onFailure: function (err) {
                callback.cognitoCallback(err.message, null);
            }
        });
    }

    logout() {
        console.log('UserLoginService: Logging out');
        try {
            localStorage.setItem('auth_token', null);
            this.router.navigate(['/login']);
            this.cognitoUtil.getCurrentUser().signOut();
        } catch (e) {}
    }

    isAuthenticated(callback: LoggedInCallback) {
        if (callback == null) {
            throw('UserLoginService: Callback in isAuthenticated() cannot be null');
        }

        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log('UserLoginService: Couldnt get the session: ' + err, err.stack);
                    callback.isLoggedIn(err, false);
                } else {
                    console.log('UserLoginService: Session is ' + session.isValid());
                    callback.isLoggedIn(err, session.isValid());
                }
            });
        } else {
            console.log('UserLoginService: cannot retrieve the current user');
            callback.isLoggedIn('Cannot retrieve the CurrentUser', false);
        }
    }

}

@Injectable()
export class UserParametersService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    getParameters(callback: Callback) {
        const cognitoUser = this.cognitoUtil.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function (err, session) {
                if (err) {
                    console.log('UserParametersService: Could not retrieve the user');
                } else {
                    cognitoUser.getUserAttributes(function (err, result) {
                        if (err) {
                            console.log('UserParametersService: in getParameters: ' + err);
                        } else {
                            callback.callbackWithParam(result);
                        }
                    });
                }

            });
        } else {
            callback.callbackWithParam(null);
        }
    }
}

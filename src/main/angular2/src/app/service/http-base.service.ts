import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpBaseService {

    employeeLambdaURL = environment.lambdaurl;

    constructor() {}

    public getHeaderOptions(auth_token) {
        const header = new Headers({ 'Authorization': auth_token });
        const options = new RequestOptions({ headers: header });
        return options;
    }

    public extractData(res: Response) {
        const body = JSON.parse( res.json() );
        console.log('Received JSON from Server >>> ' + res.json() );
        return body || { };
    }
}

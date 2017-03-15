export class Login {
    public authToken: string;
    public email: string;
    public lastLoginDate: string;
    public authFailure = false;
    constructor(
        public username: string,
        public password: string
    ) {

    }
}

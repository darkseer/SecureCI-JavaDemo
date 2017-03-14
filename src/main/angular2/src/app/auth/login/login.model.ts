export class Login {
    public authToken: string;
    public email: string;
    public lastLoginDate: string;
    constructor(
        public username: string,
        public password: string
    ) {

    }
}

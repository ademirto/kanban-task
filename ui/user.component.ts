
export class User {
  constructor(
    public firstname?: string,
    public lastname?: string,
    public email?: string,
    public password?: string,
    public confirmPassword?: string
  ) {}

  usernameFromEmail() {
    return this.email.split('@')[0];
  }
}

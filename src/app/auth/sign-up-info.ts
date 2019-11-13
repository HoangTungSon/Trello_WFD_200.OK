export class SignUpInfo {
  phoneNumber: string;
  username: string;
  email: string;
  role: string[];
  password: string;

  constructor(phoneNumber: string, username: string, email: string, password: string) {
    this.phoneNumber = phoneNumber;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = ['user'];
  }
}

export class SignUpInfo {
  phoneNumber: string;
  userName: string;
  email: string;
  role: string[];
  password: string;

  constructor(phoneNumber: string, userName: string, email: string, password: string) {
    this.phoneNumber = phoneNumber;
    this.userName = userName;
    this.email = email;
    this.password = password;
    this.role = ['user'];
  }
}

export class PassForm {
  userId: number;
  username: string;
  oldPassword: string;
  newPassword: string;

  constructor(userId: number, username: string, oldPassword: string, newPassword: string) {
    this.userId = userId;
    this.username = username;
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }
}

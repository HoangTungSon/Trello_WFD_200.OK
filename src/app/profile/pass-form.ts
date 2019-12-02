export class PassForm {
  userId: string;
  username: string;
  currentPassword: string;
  newPassword: string;

  constructor(userId: string, username: string, currentPassword: string, newPassword: string) {
    this.userId = userId;
    this.username = username;
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}

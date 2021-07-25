export interface MessengerUser {
  _id: string;
  firstname: string;
  surname: string;
  username: string;
  password: string;
  dob: Date;
  profile: string;
  gender: string;
  lastseen: Date;
  online: string;
  unreadMessages: number;
}

export class userLogin {
  passWord: string;
  email: string;
}
export class userSign {
  passWord: string;
}
export class resultLogin {
  token: string;
  userID: number;
  name: string;
  email: string;
  phone: number;
  birthDate: Date;
  gender: boolean;
  role: boolean;
  avatar: string;
}
export type token = { token: string };
export type resultUpload = { message: string; avatar: string };

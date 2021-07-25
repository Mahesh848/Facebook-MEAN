export interface Message {
  from: string;
  message: string;
  to: string;
  read: boolean;
  delete: number;
}

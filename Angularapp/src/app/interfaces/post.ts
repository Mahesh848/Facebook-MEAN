import { Comment } from './comment';
export interface Post {
  _id: string;
  type: number;
  uploader: string;
  uploadername: string;
  uploaderprofile: string;
  description: string;
  location: string;
  noOflikes: number;
  noOfcomments: number;
  likedBy: string[];
  comments: Comment[];
  uploadedDate: Date;
  shares: number;
  sharer: string;
  sharername: string;
  sharerprofile: string;
}

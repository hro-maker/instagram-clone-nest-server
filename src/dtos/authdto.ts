
import { User } from 'src/models/user';

export class registerdto{
    email:string
    password:string
    name:string
    surename:string
}
export class logindto{
    email:string
    password:string
}
export interface loginresponse{
    token:string,
    user:User
}
export interface registerresponse{
    message:string
}
export interface resetpassword{
    userId:string
    password:string
    forreset:string
}
export interface changepassword{
    old:string,
    new:string
}
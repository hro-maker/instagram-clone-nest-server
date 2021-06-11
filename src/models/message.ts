import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Room } from "./room";

export type  MessageDocument= Message & Document;

@Schema()
export class Message{
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    romId:Room
    
    @Prop({ type:String})
    text: String; 
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    senter:User
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    secnt:User

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;    
}
export const  MessageSchema = SchemaFactory.createForClass(Message);
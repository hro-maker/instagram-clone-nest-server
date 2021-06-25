import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Events, EventsDocument } from "src/models/events";
import { Message, MessageDocument } from "src/models/message";
import { Room, RoomDocument } from "src/models/room";
import { User, UserDocument } from "src/models/user";

export interface getmessages{
    messages:MessageDocument[],
    room:RoomDocument
}
export interface getrooms{
    rooms:RoomDocument[]
}
@Injectable()
export class Messageservise{
    constructor( 
         @InjectModel(User.name) private userModel: Model<UserDocument>,
         @InjectModel(Message.name) private Messagemodal: Model<MessageDocument>,
         @InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
         @InjectModel(Events.name) private eventsmodel: Model<EventsDocument>,
         ){}
    async getmessage(Fuser,Suser):Promise<getmessages>{
       try {
        const rooms= await this.RoomModel.find().populate('romusers','_id name surename avatar isActive')
        const firstregex = new RegExp(String(Fuser), 'g');
        const secntregex = new RegExp(String(Suser), 'g');
         const room=rooms.filter(el=>firstregex.test(el.users) && secntregex.test(el.users))[0]
             if(room){
              const  messages=await this.Messagemodal
              .find({romId:room._id})
              .populate("senter",'_id name surename avatar')
              .populate('secnt','_id name surename avatar')   
                     return {
                        messages,
                        room:room
                     }
             }else{
                    let newroom=await this.RoomModel.create({
                        romusers:[Fuser,Suser],
                        users:`${Fuser}${Suser}`,
                        createdAt:Date.now(),
                        updatedAt:Date.now()
                    })
                    newroom=await this.RoomModel.findOne({_id:newroom._id})
                    .populate('romusers','_id name surename avatar isActive')
                    .populate("senter",'_id name surename avatar')
                    .populate('secnt','_id name surename avatar')  
                    return {
                        messages:[],
                        room:newroom
                    }
             }
       } catch (error) {
          throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
       }
    }   
    async getallchatrooms(myid):Promise<getrooms>{
        const rooms=await this.RoomModel.find()
        .populate('romusers','_id name surename avatar isActive')
        .populate('likes','_id name surename avatar')
        
        const reg = new RegExp(String(myid), 'g');
        const myrooms:any=rooms.filter(el=>el.users.includes(String(myid)))
        return {rooms:myrooms}
    }
    async remooveall(){
            await this.Messagemodal.remove({})
            await this.RoomModel.remove({})
    }
    async getallevents(userId){
        const events=await this.eventsmodel.find({object:userId})
        .populate('post','_id imageUrl')
        .populate('subject','name avatar')
        console.log("myevents",events)
        return events
    }
    async readallevents(userId){
       await this.eventsmodel.updateMany({object:userId,readed:false},{readed:true}).then(()=>{
            return true
        }).catch((err)=>{
            console.log(err)
            return false
        })
    }
}
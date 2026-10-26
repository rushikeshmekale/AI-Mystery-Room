import mongoose from 'mongoose';
const sessionSchema=new mongoose.Schema({tokenHash:{type:String,required:true,unique:true,index:true},createdAt:{type:Date,default:Date.now},lastSeenAt:{type:Date,default:Date.now},expiresAt:{type:Date,required:true,expires:0}},{versionKey:false});
export const Session=mongoose.model('Session',sessionSchema);

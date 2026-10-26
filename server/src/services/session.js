import { createHash, randomBytes } from 'node:crypto';
import { Session } from '../models/Session.js';
const digest=(token)=>createHash('sha256').update(token).digest('hex');
export async function ensureSession(req,res){
 let token=req.cookies?.casefile_session;let session=token?await Session.findOne({tokenHash:digest(token),expiresAt:{$gt:new Date()}}):null;
 const days=Number(process.env.SESSION_TTL_DAYS)||30;
 if(!session){token=randomBytes(32).toString('base64url');session=await Session.create({tokenHash:digest(token),expiresAt:new Date(Date.now()+days*86400000)});res.cookie('casefile_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:days*86400000,path:'/'});}
 else {session.lastSeenAt=new Date();session.expiresAt=new Date(Date.now()+days*86400000);await session.save();}
 return session;
}
export async function getSession(req){
 const token=req.cookies?.casefile_session;if(!token)return null;
 const session=await Session.findOne({tokenHash:digest(token),expiresAt:{$gt:new Date()}});if(!session)return null;
 const days=Number(process.env.SESSION_TTL_DAYS)||30;session.lastSeenAt=new Date();session.expiresAt=new Date(Date.now()+days*86400000);await session.save();return session;
}

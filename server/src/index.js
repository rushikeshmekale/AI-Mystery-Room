import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { router as casesRouter } from './routes/cases.js';
const app=express();
app.disable('x-powered-by');app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',credentials:true}));app.use(express.json({limit:'20kb'}));app.use(cookieParser());
app.use((req,res,next)=>{res.locals.requestId=randomUUID();res.setHeader('X-Request-Id',res.locals.requestId);next();});
app.get('/api/v1/health',(req,res)=>res.status(mongoose.connection.readyState===1?200:503).json({data:{status:mongoose.connection.readyState===1?'ok':'not_ready'},error:null,requestId:res.locals.requestId}));
const generationLimit=rateLimit({windowMs:60*60*1000,limit:5,standardHeaders:true,legacyHeaders:false,message:{data:null,error:{code:'RATE_LIMITED',message:'You’ve reached the case creation limit. Please try again later.'}}});
app.use('/api/v1/cases', (req,res,next)=>req.method==='POST'&&req.path==='/'?generationLimit(req,res,next):next(), casesRouter);
app.use((err,req,res,next)=>{if(res.headersSent)return next(err);const status=err.status&&Number.isInteger(err.status)?err.status:500;const code=err.code||'INTERNAL_ERROR';const message=status>=500?(status===500?'The service is temporarily unavailable. Please try again.':err.message||'The service is temporarily unavailable. Please try again.'):err.message;console.error(JSON.stringify({requestId:res.locals.requestId,code,status}));res.status(status).json({data:null,error:{code,message},requestId:res.locals.requestId});});
const port=Number(process.env.PORT)||5000;
try{await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/ai-mystery-room');app.listen(port,()=>console.log(`Casefile API listening on ${port}`));}catch(error){console.error(JSON.stringify({code:'DATABASE_CONNECTION_FAILED',message:error.message}));process.exit(1);}


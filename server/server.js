import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import 'dotenv/config'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRouter from './routes/userRouter.js';


// middleware 
const app = express();
const port = process.env.PORT || 3000 ;


app.use(clerkMiddleware())
app.use(cors())
app.use(express.json())

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1j9mur9.mongodb.net/${process.env.DB_NAME}`;

mongoose.connect(URI)
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ Database Error:", err));



app.get('/', (req, res) => {
  res.send('Server is Live');
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use('/api/show',   showRouter)
app.use('/api/booking',bookingRouter)
app.use('/api/admin' , adminRouter)
app.use('/api/user' , userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

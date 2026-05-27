require('dotenv').config();
const express=require('express');
const app=express();
const verifyjwt=require('./middleware/verifyJWT');
const helmet=require('helmet');


const ratelimit=require('express-rate-limit');
const cookieParser=require('cookie-parser');
const {authlimiter}=require('./middleware/ratelimit');
const {apilimiter}=require('./middleware/ratelimit');
const{registerLimiter}=require('./middleware/ratelimit');
const path=require('path');

const xss = require('xss');
const mongoose=require('mongoose');
const connectDB=require('./config/dbconnect');
const port=8080;
const cors=require('cors');
const corsOptions=require('./config/corsOptions');
const mongoSanitize = (obj) => {
  if (!obj || typeof obj !== "object") return;

  for (let key in obj) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object") {
      mongoSanitize(obj[key]);
    }
  }
};
connectDB();
app.use( 
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, // turn ON later when frontend is ready
  })
);
app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  // sanitize body
  if (req.body && typeof req.body === "object") {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  next();
});
app.use((req, res, next) => {
  mongoSanitize(req.body);
  mongoSanitize(req.query);
  next();
});

app.use(express.static(path.join(__dirname,'/public')));
app.use('/',require('./routes/root'));
app.use('/register',registerLimiter,require('./routes/api/register'));
app.use('/auth',authlimiter,require('./routes/api/auth'));
app.use('/refresh',require('./routes/api/refresh'));
app.use('/logout',require('./routes/api/logout'));
app.use('/notes',apilimiter,verifyjwt,require('./routes/api/notesroutes'));



mongoose.connection.once('open',()=>{
    console.log("mongodb is connected");
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
})

})

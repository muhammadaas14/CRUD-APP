// defining paths
const express = require('express');
const app = express();
const session = require('express-session')
const path = require ('path')
const port = process.env.PORT||5000
let env = require ('dotenv').config();
// declaring middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static('./routes/upload'))

app.use(express.json())
app.set(('views'),path.join(__dirname,"./views"))
app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:true
}));
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message;
    next();
  });
  app.use("/",require('./routes/routes'))
  app.set("view engine","ejs");
// connecting to db
const connectdb = require('./controllers/db/conn');
connectdb();



app.listen(port,()=>{
    console.log(`server is established on http://localhost:${port}`);
})
const express = require('express')
const app = express()
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const authRouter = require('./Routes/auth')
const indexRouter = require('./Routes/index')
const profileRouter = require('./Routes/profile')
const postRouter = require('./Routes/post')
const uploadRouter = require('./Routes/upload')
const commentRouter = require('./Routes/comment')


// client id = 573232329729-to3qocc857ujfjcmgpimkfp9m2pfcpmt.apps.googleusercontent.com
// client secret = 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

const mongoose = require('mongoose')
app.set("veiw engine","ejs")
require('./models/Post')
require('./models/User')
const db = require('./config/db')
db()
// console.log(path.join(__dirname, 'views'))
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(session({
    secret:'myseceretkey',
    resave:true,
    saveUninitialized:true,
    store:new MongoStore({mongooseConnection: mongoose.connection}),
}))
app.use(passport.initialize())
app.use(passport.session())
// console.log(Date.now())

const posts = mongoose.model('posts')
const users = mongoose.model('users')
const GoogleStrategy = require("passport-google-oauth20").Strategy
passport.use(
   new GoogleStrategy 
      (  {
            clientID:'573232329729-to3qocc857ujfjcmgpimkfp9m2pfcpmt.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL:'http://localhost:5000/auth/google/callback',
        },
 async (accessToken,refreshToken,profile,done)=>{
    const newUser = {
        googleID:profile.id,
        firstName:profile.name.givenName,
        lastName:profile.name.familyName,
        displayName:profile.displayName,
        email:profile.emails[0].value,
        image:profile.photos[0].value,
    }
    try {
        let user = await users.findOne({googleID:profile.googleID})
        if (user){
            //user exists
            console.log('user already exists',user)
            done(null,user)
        }
        else{
            user = await users.create(newUser)
            done(null,user)
        }
    } catch (error) {
        console.log('error in signin ',error)
        done(error,null)
    }
    // console.log(profile)
})
)

app.use('/post',postRouter)
app.use('/auth',authRouter)
app.use('/',indexRouter)
app.use('/profile',profileRouter)
app.use('/get',uploadRouter)
app.use('/',commentRouter)


app.use('/*',(req,res)=>{
    res.render('error-404.ejs')
})

passport.serializeUser((user,done)=>{
    // console.log(user.id)
  done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    try {
        const user = await users.findById(id)
        done(null,user)
    } catch (error) {
        done(error)
    }
})


app.listen(5000,()=>{
    console.log('app is running at port 5000')
})


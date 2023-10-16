const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get("/google",passport.authenticate("google",{

    scope:["profile","email"],

}),(req,res)=>{

    // console.log('inside call')
    // console.log(req.body)
})

router.get("/google/callback",passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    const user = req.user

    if (user.role === null){
        res.redirect('/signup')
    }
    // console.log('call back is called')
    else{
        
        
        // console.log("user id is ",user_id)
        res.redirect('/dashboard')
    }
    
})
router.get('/logout',(req,res)=>{
    req.logout(()=>{
     res.redirect('/')
    })
    // res.redirect('/')
})
module.exports = router

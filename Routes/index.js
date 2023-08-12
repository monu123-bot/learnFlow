const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Post')
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const {ensureNewUser,ensureSignUp, ensureCreator} = require('../middleware/user')

const {fetchAllPost} = require('../middleware/post')
require('../models/User')

const users = mongoose.model('users')
const posts = mongoose.model('posts')


router.get('/',ensureGuest,(req,res)=>{
    res.render('login.ejs')
})
router.get("/filter_post/:creator_id",ensureAuth,ensureSignUp,ensureCreator,async (req,res)=>{
    // console.log(req.params.creator_id)
    const filtered_posts = await posts.find({userID:req.params.creator_id})
    res.locals.posts = filtered_posts
    res.locals.user = req.user
    res.render('dashboard.ejs')
})
router.get("/delete_post/:post_id",ensureAuth,ensureSignUp,ensureCreator, async (req,res)=>{
    const resp = await posts.deleteOne({_id:req.params.post_id})
    res.redirect(`/filter_post/${req.user._id}`)

})
router.get("/dashboard",ensureAuth,ensureSignUp,fetchAllPost,async (req,res)=>{

    // console.log('inside dashbo')
    // const posts = ['post1','post2','post3','post4','post5']
    res.locals.user = req.user
    // res.locals.posts = post
    res.render("dashboard.ejs")

})
router.get('/signup',ensureAuth,ensureNewUser,(req,res)=>{
    res.render('signup-profile.ejs')
})
router.patch('/user/update/role',ensureAuth,ensureNewUser, async(req,res)=>{


    try {
        const user =  req.user
    user.role = req.body.role
    const resp = await user.save()
    res.status(200).send(resp)
    } catch (error) {
        res.status(500).send({
            error:error
        })
        
    }
    
})
module.exports = router

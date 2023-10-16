const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { ensureCreator, ensureSignUp } = require('../middleware/user')
const { ensureAuth } = require('../middleware/auth')
const moment = require('moment')
require('../models/Post')
require('../models/User')
require('../models/Comment')
const comments = mongoose.model('Comments')
const users = mongoose.model('users')
const posts = mongoose.model('posts')
router.get('/create/new',ensureAuth,ensureSignUp,ensureCreator,(req,res)=>{
 res.render('create_post.ejs')
})

router.post('/create/new',ensureAuth,ensureSignUp,ensureCreator,async (req,res)=>{

    // console.log(req.body.title,req.body.description)

    try {
        const post =  new posts ({
            ...req.body,
            userID:req.user.id
    
        })
        const resp = await post.save()
        res.send(resp)
    } catch (error) {
        res.send(error)
    }
})
router.get('/:id',async (req,res)=>{

    try {
        const post = await posts.findById(req.params.id)
        if (!post){
            return res.render('error-404.ejs')
        }
        console.log('post user id',post.userID)
        const author = await users.findById(post.userID)
        console.log("author",  author)
        const comment = await comments.find({postID:req.params.id,parentID:null})
        // console.log('comment',comment)
        const postdate = moment(post.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")
        res.locals.author = author
        res.locals.user = req.user
        res.locals.postDate = postdate
    res.locals.post = post
    res.locals.comments = comment
    res.render('post.ejs')
    } catch (error) {
        res.send(error)
    }
    
})


module.exports = router
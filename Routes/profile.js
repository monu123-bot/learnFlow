const express = require('express')
const router = express.Router()

const {ensureAuth} = require('../middleware/auth')
const {ensureSignUp} = require('../middleware/user')
const { default: mongoose } = require('mongoose')
require('../models/User')



router.get('/settings',ensureAuth,ensureSignUp,(req,res)=>{
    res.render('profile-settings.ejs')
})

router.patch('/update',async (req,res)=>{

    try {
        const profileData = req.body
    const user = req.user
    for (const key in profileData){ 
        user[key] = profileData[key]
    }
    
    const resp = await user.save()
    console.log(profileData)
    res.send(resp)
    } catch (error) {
        console.log(error)
        res.status(500).send('there is an error in updating profile ',error)
    }
    
})

module.exports = router
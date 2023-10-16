const ensureAuth = (req,res,next)=>{
    // console.log('inside auth 1')
    // console.log(req.user.firstName)
    
   if (req.isAuthenticated()){
    // console.log('inside auth 2',)
    res.locals.user = req.user
    

    // console.log('local',res.locals.user.firstName)
    return next()
   }
   else{
    // console.log('inside auth 3')
    res.redirect('/')
   }
   
}

const ensureGuest = (req,res,next)=>{
//    console.log(req.user)
    if (req.isAuthenticated()){
        
        res.redirect('/dashboard')
       }
       next()

}

module.exports = {ensureAuth,ensureGuest}
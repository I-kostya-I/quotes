module.exports.access = (roles, checkToken) => {

    return async (req, res, next) => { 
        
        if(req.user.userData.role === req.user.payload.role && roles.indexOf(req.user.userData.role) != -1 ){
            next()
        }else{
            res.status(403).json({message  : "У пользователя недостаточно прав доступа к ресурсу"})
            return
        } 

    }
} 
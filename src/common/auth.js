import bcrypt from 'bcryptjs'
import jwt,{decode} from 'jsonwebtoken'
const SALT = 10

const  createHash = async(data)=>{
    let salt = await bcrypt.genSalt(SALT)
    let hash = await bcrypt.hash(data,salt)
    return hash
}

const hashCompare= async(data,hash)=>{
    return await bcrypt.compare(data,hash)
}

const createToken= async(payload)=>{
    let token = await jwt.sign(payload,process.env.JWE_SECRET,{
        expiresIn:process.env.JWE_EXPIRE
    })
    return token
}
const decodeToken = async(token)=>{
    return await jwt.decode(token)
}

const  Authenticate = async(req,res,next)=>{
    let token = req?.headers?.authorization?.split(" ")[1]
    
    if(token)
    {
        let payload = await decodeToken(token)
        let currenttime = +new Date() 
    //   console.log(Math.floor(currenttime/1000));
    // console.log( payload.exp);
    if(Math.floor(currenttime/1000)<payload.exp){
        next()   
    }
    else{
        res.status(402).send({
            message:"section expire "
        })
    }
          
    }
    else
    {
        res.status(402).send({
            message:"Unauthorised access"
        })
    }
    
}

const adminGuard = async(req,res,next)=>{
    let token = req?.headers?.authorization?.split(" ")[1]    
    if(token)
    {
        let payload = await decodeToken(token)
        if(payload.role==='admin')
        {
            next()
        }
        else{
            res.status(402).send({
                message:"Only Admins are allowed"
            })
        }
    }
    else
    {
        res.status(402).send({
            message:"Unauthorised access"
        })
    }
    
}
export default {
    createHash,
    hashCompare,
    createToken,
    Authenticate,
    adminGuard
}

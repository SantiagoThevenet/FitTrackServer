import { createAccessToken } from "../libs/jwt.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from "../config.js";


export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const userFound = await User.findOne({ email })
        if (userFound) return res.status(400).json({ message: "The mail already exist" })

        const newUser = User({
            username,
            email,
            password
        })

        const userSaved = await newUser.save()

        const token = await createAccessToken({id: userSaved._id})

        res.cookie('token', token)

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}


export const login = async (req, res) => {
    try {
        const {email, password} = req.body
        const [userFound] =  await User.find({email, password})
        if (!userFound || userFound<= 0) return res.status(400).json({message: "Password or email are incorrect"}) 
    
        const token = await createAccessToken({id: userFound._id.toString()})
        res.cookie('token', token)
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const logout = async (req, res) => {
    res.cookie('token',"", {
        expires: new Date(0)
    })

    return res.sendStatus(200)
}

export const verifyToken = async (req, res) => {
    const {token} = req.cookies
    
    if (!token) return res.status(401).json({message: "Unauthorize"})

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({message: "Unauthorized"}) 

        const userFound = await User.findById(user.id)

        if (!userFound) return res.status(401).json({message: "Unauthorized"})

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        })
    })
}
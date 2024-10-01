import jwt from 'jsonwebtoken';

export function generateTokenandSetCookie(userId, res){
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '15d',
    });

    res.cookie("user",token,{
        maxAge: 15*24*60*60*1000,

    });
}

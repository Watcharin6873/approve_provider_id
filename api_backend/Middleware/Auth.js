
const conn = require('../Config/ConnectDB')
const jwt = require('jsonwebtoken')
const secret = "@Provider#2024"

exports.auth = (req, res, next)=>{
    try {
        //Code
        var token = req.headers.authorization.split(' ')[1];
        if (!token){
            res.status(401).send('No token, authorization denied.')
        }
        const decoded = jwt.verify(token, secret)

        console.log('middleware', decoded)

        req.user = decoded.user
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send('Token invalid')
    }
}

exports.approverCheck = (req, res, next) => {
    try {
        //Code
        const sql = "SELECT `user_id`, `hospital_code`,`fullname`,`job_position`,`username`,`level` FROM `app_users` WHERE `username`=?";
        conn.query(sql, [req.user.username], (err, data)=>{
            if(err) throw err;
            if (data[0].level !== '2'){
                res.status(403).send('Admin access denied!')
            }else{
                next()
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}
const conn = require('../Config/ConnectDB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = "@Provider#2024"

exports.login = async (req, res) => {
    try {
        //Code
        const sql = "SELECT * FROM app_users WHERE username=?";

        conn.query(sql, [req.body.username], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                bcrypt.compare(req.body.password, data[0].password_hash, (err, response) => {
                    if (err) throw err;
                    if (response) {
                        const payload = {
                            user: {
                                user_id: data[0].user_id,
                                hospital_code: data[0].hospital_code,
                                fullname: data[0].fullname,
                                job_position: data[0].job_position,
                                username: data[0].username,
                                level: data[0].level
                            }
                        }

                        jwt.sign(payload, secret, { expiresIn: '3h' }, (err, token) => {
                            if (err) throw err;
                            res.json({ token, payload })
                        })

                    } else {
                        res.status(400).send('Password ไม่ถูกต้อง!')
                    }
                })
            } else {
                res.status(400).send('ไม่พบ User กรุณาสมัครเข้าใช้งาน!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}


exports.loginByProviderId = async (req, res) => {
    try {
        //Code
        const sql = "SELECT * FROM app_users WHERE fullname LIKE ? AND hospital_code=?";

        conn.query(sql, ['%'+req.body.fullname+'%', req.body.hospital_code], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                const payload = {
                    user: {
                        user_id: data[0].user_id,
                        hospital_code: data[0].hospital_code,
                        fullname: data[0].fullname,
                        job_position: data[0].job_position,
                        username: data[0].username,
                        level: data[0].level
                    }
                }

                jwt.sign(payload, secret, { expiresIn: '3h' }, (err, token) => {
                    if (err) throw err;
                    res.json({ token, payload })
                })
            } else {
                res.status(400).send('ไม่พบ User กรุณาสมัครเข้าใช้งาน!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}



exports.currentUser = async (req, res) => {
    try {
        //Code
        const sql = "SELECT `user_id`, `hospital_code`,`fullname`,`job_position`,`username`,`level` FROM `app_users` WHERE `username`=?";
        conn.query(sql, [req.user.username], (err, data) => {
            if (err) throw err;
            res.json(data)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}
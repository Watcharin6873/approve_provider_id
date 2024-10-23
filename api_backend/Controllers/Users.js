const conn = require('../Config/ConnectDB')
const bcrypt = require('bcrypt')
const moment = require('moment')
const salt = 10;


exports.createUser = async (req, res) => {
    try {
        //Code
        const d_create = moment(req.body.d_create).format('YYYY-MM-DD hh:mm:ss')
        const sql = "INSERT INTO `app_users` (`hospital_code`, `fullname`, `job_position`, `username`, `password`, `password_hash`,`level`,`d_create`) VALUES (?)";
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.log(err)
            }

            const values = [
                req.body.hospital_code,
                req.body.fullname,
                req.body.job_position,
                req.body.username,
                req.body.password,
                hash,
                req.body.level,
                d_create
            ]
            conn.query(sql, [values], (err, results) => {
                if (err) throw err;
                if (results){
                    res.send('เพิ่มข้อมูลผู้ใช้งานสำเร็จ!')
                }
            }
            )
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.createUserByProviderID = async(req, res)=>{
    try {
        //Code
        const d_create = moment(req.body.d_create).format('YYYY-MM-DD hh:mm:ss')
        const sql = "INSERT INTO `app_users` (`hospital_code`, `fullname`, `job_position`, `email`, `username`, `password`, `password_hash`,`level`,`d_create`) VALUES (?)";
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
                console.log(err)
            }

            const values = [
                req.body.hospital_code,
                req.body.fullname,
                req.body.job_position,
                req.body.email,
                req.body.username,
                req.body.password,
                hash,
                req.body.level,
                d_create
            ]
            conn.query(sql, [values], (err, results) => {
                if (err) throw err;
                if (results){
                    res.status(200).send('เพิ่มข้อมูลผู้ใช้งานสำเร็จ!')
                }
            }
            )
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.getListUsers = async (req, res) => {
    try {
        //Code
        const sql = "SELECT t1.user_id,t1.hospital_code,t2.hospital_name," +
            "t1.fullname,t1.job_position,t1.username,t1.`password`," +
            "t1.password_hash,t1.`level`,t1.d_create,t1.d_update" +
            " FROM app_users AS t1 LEFT JOIN app_hospitals AS t2 " +
            " ON t1.hospital_code = t2.hospital_code";
        conn.query(sql, (err, results) => {
            if (err) throw err;
            return res.json(results)
        }
        )
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}


exports.getUserByID = async (req, res) => {
    try {
        //Code
        const sql = "SELECT t1.user_id,t1.hospital_code,t2.hospital_name," +
            "t1.fullname,t1.job_position,t1.username,t1.`password`," +
            "t1.password_hash,t1.`level`,t1.d_create,t1.d_update" +
            " FROM app_users AS t1 LEFT JOIN app_hospitals AS t2 " +
            " ON t1.hospital_code = t2.hospital_code WHERE user_id=?";
        conn.query(sql, [req.params.id], (err, results) => {
            if (err) throw err;
            return res.json(results)
        }
        )
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.updateUser = async (req, res) => {
    try {
        //Code
        const sql = "UPDATE app_users SET `hospital_code`=?,`fullname`=?,`job_position`=?,`username`=?," +
            "`level`=?,`d_create`=?,`d_update`=? WHERE `user_id`=?";

        const d_create = moment(req.body.d_create).format('YYYY-MM-DD hh:mm:ss')
        const d_update = moment(req.body.d_update).format('YYYY-MM-DD hh:mm:ss')

        conn.query(sql, [req.body.hospital_code,
        req.body.fullname,
        req.body.job_position,
        req.body.username,
        req.body.level,
            d_create,
            d_update,
        req.params.id
        ], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('แก้ไขข้อมูลผู้ใช้เรียบร้อย!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}


exports.resetPassword = async (req, res) =>{
    try {
        //Code
        const sql = "UPDATE app_users SET `password`=?,`password_hash`=?,`d_update`=? WHERE `user_id`=?";
        const d_update = moment(req.body.d_update).format('YYYY-MM-DD hh:mm:ss')
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if (err) throw err;

            conn.query(sql, [req.body.password, hash, d_update, req.params.id], (err, results)=>{
                if (err) throw err;
                if (results) {
                    res.send('Reset password success successfully!')
                }
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}
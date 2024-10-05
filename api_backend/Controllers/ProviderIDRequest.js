const conn = require('../Config/ConnectDB')
const moment = require('moment')

exports.createProviderIDRequest = async (req, res) => {
    try {
        //Code
        const sql = "INSERT INTO `app_provider_request` (`req_hospital_code`,`req_service_name`, `req_public_ip`,`req_redirect_url`, " +
            "`req_objective`, `req_email`, `req_detail_profile_data`, `req_detail_job`, `req_date`, `req_status`) VALUES (?)";

        const curdate = moment(req.body.req_date).format('YYYY-MM-DD hh:mm:ss')
        const values = [
            req.body.req_hospital_code,
            req.body.req_service_name,
            req.body.req_public_ip,
            req.body.req_redirect_url,
            req.body.req_objective,
            req.body.req_email,
            req.body.req_detail_profile_data,
            req.body.req_detail_job,
            curdate,
            req.body.req_status
        ]

        conn.query(sql, [values], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('บันทึกคำขอใช้ API ProviderID เรียบร้อยแล้ว!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.getListProviderIDRequest = async (req, res) => {
    try {
        //Code
        const sql = "SELECT t1.*, t2.hospital_name FROM app_provider_request AS t1 LEFT JOIN app_hospitals AS t2" +
            " ON t1.req_hospital_code = t2.hospital_code ORDER BY t1.req_date DESC";
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

exports.getProviderIDRequestByID = async (req, res) => {
    try {
        //Code
        const sql = "SELECT t1.*, t2.hospital_name FROM app_provider_request AS t1 LEFT JOIN app_hospitals AS t2" +
            " ON t1.req_hospital_code = t2.hospital_code WHERE req_id=?";
        conn.query(sql, [req.params.id], (err, results) => {
            if (err) throw err;
            return res.json(results)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!')
    }
}

exports.updateClientAndSecretKey = async (req, res) => {
    try {
        //Code
        const curdate = moment(req.body.req_date_input_token).format('YYYY-MM-DD hh:mm:ss')
        const sql = "UPDATE app_provider_request SET `req_status`=?,`req_health_client_uat`=?,`req_health_secret_uat`=?," +
            "`req_health_client_prd`=?,`req_health_secret_prd`=?,`req_provider_client_uat`=?," +
            "`req_provider_secret_uat`=?,`req_provider_client_prd`=?,`req_provider_secret_prd`=?,`req_date_input_token`=? WHERE `req_id`=?";

        conn.query(sql, [req.body.req_status,
        req.body.req_health_client_uat,
        req.body.req_health_secret_uat,
        req.body.req_health_client_prd,
        req.body.req_health_secret_prd,
        req.body.req_provider_client_uat,
        req.body.req_provider_secret_uat,
        req.body.req_provider_client_prd,
        req.body.req_provider_secret_prd,
            curdate,
        req.params.id], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('บันทึก Client ID & Secret key เรียบร้อยแล้ว!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}


exports.updateStatusProviderRequest = async (req, res) => {
    try {
        //Code
        const sql = "UPDATE app_provider_request SET `req_status`=? WHERE `req_id`=?";

        conn.query(sql, [req.body.req_status, req.params.id], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('Update สถานะคำขอเรียบร้อยแล้ว!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.updateProviderRequest = async (req, res) => {
    try {
        //Code
        const sql = "UPDATE app_provider_request SET `req_hospital_code`=?,`req_service_name`=?, `req_public_ip`=?,`req_redirect_url`=?," +
            "`req_objective`=?, `req_email`=?, `req_detail_profile_data`=?, `req_detail_job`=?, `req_date`=?, `req_status`=? WHERE `req_id`=?";

        const curdate = moment(req.body.req_date).format('YYYY-MM-DD hh:mm:ss')
        conn.query(sql, [req.body.req_hospital_code,
        req.body.req_service_name,
        req.body.req_public_ip,
        req.body.req_redirect_url,
        req.body.req_objective,
        req.body.req_email,
        req.body.req_detail_profile_data,
        req.body.req_detail_job,
            curdate,
        req.body.req_status,
        req.params.id], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('Update ข้อมูลคำขอเรียบร้อยแล้ว!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}

exports.removeProviderRequest = async (req, res) => {
    try {
        //Code
        const sql = "DELETE FROM app_provider_request WHERE req_id=?";

        conn.query(sql, [req.params.id], (err, results) => {
            if (err) throw err;
            if (results) {
                res.send('ลบข้อมูลคำขอเรียบร้อยแล้ว!')
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}


exports.getHospitals = async (req, res) => {
    try {
        //Code
        const sql = "SELECT * FROM app_hospitals";
        conn.query(sql, (err, results) => {
            if (err) throw err;
            res.json(results)
        })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error!!')
    }
}
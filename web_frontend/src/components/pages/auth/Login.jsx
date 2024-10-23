import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { LockOutlined, UserOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Col, Row, Button, Form, Input, Modal, Radio, Space, Select, DatePicker } from 'antd';
import providerid from '../../../assets/Plogo-f6506bc1.png';
import {
    login,
    getTokenHealthID,
    getTokenProviderID,
    getProviderProfile,
    loginByProviderId,
    createUserByProviderID
} from '../../function/Auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import useTitle from '../../utills/useTitle';
import dayjs from 'dayjs'
import dayTH from "dayjs/locale/th"
import buddhistEra from 'dayjs/plugin/buddhistEra'
import th from 'antd/es/date-picker/locale/th_TH'
import moment from 'moment'
dayjs.locale(dayTH);

dayjs.extend(buddhistEra);


function Login() {

    useTitle('ล็อกอินเข้าสู่ระบบ')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [providerProfile, setProviderProfile] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [addUserByProviderID, setAddUserByProviderID] = useState(false)
    const [value, setValue] = useState('');
    const [accToken, setAccToken] = useState('')
    const [formCreateUser] = Form.useForm()
    const cDate = new Date().toISOString().slice(0, 10);

    const roleBaseRedirect = (level) => {
        if (level === '1') {
            setTimeout(() => navigate('/responder'), 2000)
        } else if (level === '2') {
            setTimeout(() => navigate('/approver'), 2000)
        }
    }

    const onFinish = (values) => {
        setLoading(true)
        login(values)
            .then(res => {
                setLoading(false)
                // console.log(res.data)
                toast.success(res.data.payload.user.username + ' Login สำเร็จ!')
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: res.data.token,
                        hospital_code: res.data.payload.user.hospital_code,
                        fullname: res.data.payload.user.fullname,
                        username: res.data.payload.user.username,
                        level: res.data.payload.user.level
                    }
                })
                localStorage.setItem('token', res.data.token)
                roleBaseRedirect(res.data.payload.user.level)
            })
            .catch(err => {
                setLoading(false)
                console.log(err.response.data)
                toast.warning(err.response.data)
            })
            .finally(() => setLoading(false))
    };

    const myParam = useLocation().search;
    const code = new URLSearchParams(myParam).get("code")

    if (code) {
        const values = {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'https://bdh-service.moph.go.th/approve_provider_id/',
            client_id: '019274d1-ac2a-7352-b73a-ca66a5b135fb',
            client_secret: '97e76d1d6eff9ac1ee377d598c0fe995f018a9c3'
        }
        getTokenHealthID(values)
            .then(res => {
                const h_token = res.data.data.access_token;
                const val2 = {
                    client_id: '49fba4c4-2c60-4d3f-b8da-3925d1ad7e65',
                    secret_key: 'F83E767464E7334923C43D1C1443B',
                    token_by: 'Health ID',
                    token: h_token
                }
                getTokenProviderID(val2)
                    .then(res => {
                        setAccToken(res.data.data.access_token)
                        const access_token = res.data.data.access_token;
                        const client_id = '49fba4c4-2c60-4d3f-b8da-3925d1ad7e65';
                        const secret_key = 'F83E767464E7334923C43D1C1443B';
                        getProviderProfile(access_token, client_id, secret_key)
                            .then(res => {
                                setProviderProfile(res.data.data)
                                setIsModalOpen(true)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .catch(err => {
                        console.log(err)
                    })

            })
            .catch(err => {
                console.log(err.response.data)
            })
    }

    const listProviderHosp = providerProfile.organization;
    // console.log('Values :', providerProfile)

    const onOk = () => {
        setIsModalOpen(false)
    }

    const cancelModal = () => {
        setIsModalOpen(false)
        setAddUserByProviderID(false)
    }

    const onRadioChange = (e) => {
        setValue(e.target.value);
        setIsModalOpen(false)
    }

    const providerValues = {
        email: providerProfile.email,
        firstname: providerProfile.firstname_th,
        lastname: providerProfile.lastname_th,
        fullname: providerProfile.name_th,
        hospital_code: value.hcode,
        position_id: value.position_id,
        position: value.position,
    }

    if (value) {
        // console.log('CountHosp: ', listProviderHosp.length)
        loginByProviderId(providerValues)
            .then(res => {
                setLoading(false)
                // console.log(res.data)
                toast.success(res.data.payload.user.username + ' Login สำเร็จ!')
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: res.data.token,
                        hospital_code: res.data.payload.user.hospital_code,
                        fullname: res.data.payload.user.fullname,
                        username: res.data.payload.user.username,
                        level: res.data.payload.user.level
                    }
                })
                localStorage.setItem('token', res.data.token)
                roleBaseRedirect(res.data.payload.user.level)
            })
            .catch(err => {
                setLoading(false)
                console.log(err.response.status)
                // toast.warning(err.response.data)
                if (err.response.status === 400) {
                    setAddUserByProviderID(true)
                }
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        formCreateUser.setFieldsValue({
            hospital_code: value.hcode,
            fullname: providerProfile.name_th,
            job_position: value.position,
            email: providerProfile.email,
            username: providerProfile.firstname_en,
            password: providerProfile.firstname_en + '#' + value.hcode,
            level: '1',
            d_create: dayjs(cDate, 'YYYY-MM-DD')
        })
    })
    const saveUser = (fieldValue) => {
        const values = {
            ...fieldValue,
            'd_create': fieldValue['d_create'].format('YYYY-MM-DD')
        }
        console.log('UserByProvider: ', values)
        createUserByProviderID(values)
            .then(res => {
                toast.success(res.data)
                setAddUserByProviderID(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed', errorInfo)
    }

    const buddhistLocale = {
        ...th,
        lang: {
            ...th.lang,
            fieldDateFormat: "DD MMMM BBBB",
            monthFormat: 'MMMM',
            yearFormat: 'BBBB',
            cellYearFormat: "BBBB",
            today: 'วันนี้'
        }
    }


    return (
        <>
            <ToastContainer />
            <Row>
                <Col span={8} offset={8}>
                    <div className='bg-white shadow border rounded' style={{ marginTop: 50, }}>
                        <div className='div-center'>
                            <h2 style={{ marginTop: '50px' }}>ระบบอนุมัติใช้งาน</h2>
                        </div>
                        <img className='img-center' src={providerid} alt='logo' width={200} />
                        {
                            loading
                                ? <h4 className='text-center'>กรุณารอสักครู่...<CircularProgress /></h4>
                                : null
                        }
                        <Form
                            name="login"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            className='form1'
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Username" size='large' />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input.Password prefix={<LockOutlined />} placeholder="Password" size='large' />
                            </Form.Item>
                            {/* <Form.Item>
                                <Flex justify="space-between" align="center">
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>
                                    <a href="">Forgot password</a>
                                </Flex>
                            </Form.Item> */}

                            <Form.Item>
                                <Button block type="primary" htmlType="submit" size='large'>
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                        <h6 className='text-center'>หรือ</h6>
                        <div className='div-center'>
                            <Button
                                style={{
                                    width: 200,
                                    marginBottom: 10
                                }}
                                size='large'
                                href='https://moph.id.th/oauth/redirect?client_id=019274d1-ac2a-7352-b73a-ca66a5b135fb&redirect_uri=https://bdh-service.moph.go.th/approve_provider_id/&response_type=code'
                            >
                                <img
                                    className='img-center'
                                    src={providerid}
                                    alt='login'
                                    width={110}
                                    style={{ padding: '10px' }}
                                />
                            </Button>
                        </div>
                        <div className='div-center' style={{ marginBottom: '50px' }}>
                            Created by : สำนักสุขภาพดิจิทัล ©{new Date().getFullYear() + 543}
                        </div>
                    </div>
                    <Modal
                        title={
                            <div
                                style={{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            >
                                <ExclamationCircleFilled style={{ color: 'orange' }} /> &nbsp;
                                <span>เลือกหน่วยบริการที่ต้องการล็อกอิน</span>
                            </div>
                        }
                        open={isModalOpen}
                        onOk={onOk}
                        onCancel={cancelModal}
                        footer={null}
                        width={400}
                        style={{top: 20}}
                    >
                        <hr />
                        <Radio.Group onChange={onRadioChange}>
                            <Space direction='vertical'>
                                {
                                    listProviderHosp && listProviderHosp.map((item, k) => (
                                        <Radio.Button 
                                            key={k} 
                                            value={item} 
                                            style={{ width: '350px' }}
                                        >
                                            {item.hname_th + ' [' + item.hcode + ']'}
                                        </Radio.Button>
                                    ))
                                }
                            </Space>
                        </Radio.Group>
                    </Modal>

                    <Modal
                        title={
                            <div
                                style={{
                                    justifyContent: 'center',
                                    display: 'flex',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            >
                                <ExclamationCircleFilled style={{ color: 'orange' }} /> &nbsp;
                                <span>ไม่พบข้อมูลในระบบ ลงทะเบียนเข้าใช้งานหรือไม่?</span>
                            </div>
                        }
                        open={addUserByProviderID}
                        onOk={formCreateUser.submit}
                        onCancel={cancelModal}
                        width={520}
                        style={{ top: 20 }}
                    >
                        <hr />
                        <Form
                            form={formCreateUser}
                            name='formCreateUser'
                            layout='vertical'
                            onFinish={saveUser}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                name='hospital_code'
                                label={<b>หน่วยบริการ :</b>}
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                                style={{ marginBottom: '10px' }}
                            >
                                <Select
                                    options={[
                                        {
                                            value: value.hcode,
                                            label: value.hname_th + ' [' + value.hcode + ']'
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name='fullname'
                                label={<b>ชื่อ-นามสกุล</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุชื่อ-สกุลผู้ใช้งาน'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <Input placeholder='กรุณาระบุชื่อ-สกุลผู้ใช้งาน...' />
                            </Form.Item>
                            <Form.Item
                                name='job_position'
                                label={<b>ตำแหน่ง :</b>}
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                                style={{ marginBottom: '10px' }}
                            >
                                <Select
                                    options={[
                                        {
                                            value: value.position,
                                            label: value.position + ' [' + value.position_id + ']'
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name='email'
                                label={<b>อีเมล</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุอีเมล'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <Input placeholder='กรุณาระบุอีเมล...' />
                            </Form.Item>
                            <Form.Item
                                name='username'
                                label={<b>Username</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ Username'
                                    },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])/,
                                        message: 'Username ต้องเป็นภาษาอังกฤษ a-z A-Z เท่านั้น!'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <Input placeholder='กรุณาระบุ Username...' />
                            </Form.Item>
                            <Form.Item
                                name='password'
                                label={<b>Password</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ Password !'
                                    },
                                    {
                                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$/,
                                        message: 'Password ต้องเป็นภาษาอังกฤษ ประกอบด้วยตัวเลข 1 ตัว ตัวพิมพ์ใหญ่ 1 ตัว ตัวพิมพ์เล็ก และ อักขระพิเศษ(!@#$%^&*) รวมกัน 8 ตัวขึ้นไป!'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <Input.Password placeholder='Password' />
                            </Form.Item>
                            <Form.Item
                                name='level'
                                label={<b>Level</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ Level'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <Select
                                    placeholder='กรุณาระบุ Level...'
                                    options={[
                                        {
                                            value: '1',
                                            label: <span style={{ color: '#098703' }}>Responder(1)</span>
                                        },
                                        // {
                                        //     value: '2',
                                        //     label: <span style={{ color: '#034b87' }}>Approver(2)</span>
                                        // }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item
                                name='d_create'
                                label={<b>วันที่เพิ่มผู้ใช้</b>}
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุวันที่เพิ่มผู้ใช้'
                                    }
                                ]}
                                style={{ marginBottom: '15px' }}
                            >
                                <DatePicker locale={buddhistLocale} style={{ width: '100%' }} disabled />
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>
        </>
    )
}

export default Login
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row, Button, Form, Input, Modal, Radio, Space } from 'antd';
import providerid from '../../../assets/Plogo-f6506bc1.png';
import { login, getTokenHealthID, getTokenProviderID, getProviderProfile, loginByProviderId } from '../../function/Auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import useTitle from '../../utills/useTitle';


function Login() {

    useTitle('ล็อกอินเข้าสู่ระบบ')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [providerProfile, setProviderProfile] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [value, setValue] = useState('');
    const [accToken, setAccToken] = useState('')

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
                console.log(err)
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
        position: value.position
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
                console.log(err)
            })
            .finally(() => setLoading(false))
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
                        title='เลือกหน่วยบริการที่ต้องการล็อกอิน'
                        open={isModalOpen}
                        onOk={onOk}
                        onCancel={cancelModal}
                        footer={null}
                    >

                        <Radio.Group onChange={onRadioChange}>
                            <Space direction='vertical'>
                                {
                                    listProviderHosp && listProviderHosp.map((item, k) => (
                                        <Radio key={k} value={item}>{item.hname_th}</Radio>
                                    ))
                                }
                            </Space>
                        </Radio.Group>
                    </Modal>
                </Col>
            </Row>
        </>
    )
}

export default Login
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row, Button, Form, Input } from 'antd';
import providerid from '../../../assets/Plogo-f6506bc1.png';
import { login } from '../../function/Auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import useTitle from '../../utills/useTitle';


function Login() {

    useTitle('ล็อกอินเข้าสู่ระบบ')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const roleBaseRedirect = (level) =>{
        if (level === '1'){
            setTimeout(() => navigate('/responder'), 2000)
        }else if(level === '2'){
            setTimeout(() => navigate('/approver'), 2000)
        }
    }

    const onFinish = (values) => {
        setLoading(true)
        login(values)
            .then(res =>{
                setLoading(false)
                console.log(res.data)
                toast.success(res.data.payload.user.username + ' Login สำเร็จ!', {theme:'colored'})
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: res.data.token,
                        hospital_code: res.data.payload.user.hospital_code,
                        user_id: res.data.payload.user.user_id,
                        fullname: res.data.payload.user.fullname,
                        username: res.data.payload.user.username,
                        level: res.data.payload.user.level
                    }
                })
                localStorage.setItem('token', res.data.token)
                roleBaseRedirect(res.data.payload.user.level)
            })
            .catch(err =>{
                setLoading(false)
                console.log(err)
            })
            .finally(()=> setLoading(false))
    };

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
                        <div className='div-center' style={{marginBottom:'50px'}}>
                            Created by : สำนักสุขภาพดิจิทัล ©{new Date().getFullYear() + 543}
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Login
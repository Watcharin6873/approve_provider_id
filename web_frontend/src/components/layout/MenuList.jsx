import { AppstoreAddOutlined, HomeOutlined, LogoutOutlined, ExclamationCircleFilled, UserAddOutlined } from '@ant-design/icons'
import { Menu, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function MenuList({ darkTheme }) {

    const { user } = useSelector((state) => ({ ...state }))
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const [current, setCurrent] = useState(location.pathname)
    const { confirm } = Modal


    useEffect(() => {
        if (location) {
            if (current !== location.pathname) {
                setCurrent(location.pathname)
            }
        }
    }, [location, current])

    const logout = () => {
        //Code
        confirm({
            title: 'คุณต้องการออกจากระบบหรือไม่?',
            icon: <ExclamationCircleFilled />,
            content: '',
            onOk() {
                dispatch({
                    type: 'LOGOUT',
                    payload: null,
                })
                navigate("/")
            },
            onCancel() {
                console.log('Cancel');
            },
        })
    }

    return (
        <>
            <Menu
                theme={darkTheme ? 'dark' : 'light'}
                mode='inline'
                className='menu-bar'
                selectedKeys={[current]}
            >
                {
                    user.level == '1'
                        ?
                        <>
                            <Menu.Item key='/responder' onClick={(e) => setCurrent(e.key)} icon={<HomeOutlined />}>
                                <Link to='/responder' style={{ textDecoration: 'none' }}>หน้าแรก</Link>
                            </Menu.Item>
                            <Menu.Item key='/responder/add-request-provider' onClick={(e) => setCurrent(e.key)} icon={<AppstoreAddOutlined />}>
                                <Link to='/responder/add-request-provider' style={{ textDecoration: 'none' }}>เพิ่มคำขอใช้ API ProviderID</Link>
                            </Menu.Item>
                            <Menu.Item key='/responder/add-users' onClick={(e) => setCurrent(e.key)} icon={<UserAddOutlined />}>
                                <Link to='/responder/add-users' style={{ textDecoration: 'none' }}>เพิ่มผู้ใช้งาน</Link>
                            </Menu.Item>
                        </>
                        :
                        <>
                            <Menu.Item key='/approver' onClick={(e) => setCurrent(e.key)} icon={<HomeOutlined />}>
                                <Link to='/approver' style={{ textDecoration: 'none' }}> หน้าแรก </Link>
                            </Menu.Item>
                            <Menu.Item key='/approver/add-token' onClick={(e) => setCurrent(e.key)} icon={<AppstoreAddOutlined />}>
                                <Link to='/approver/add-token' style={{ textDecoration: 'none' }}> เพิ่ม Clinent ID & Secret key</Link>
                            </Menu.Item>
                        </>
                }
                <Menu.Item key='logout' onClick={logout} icon={<LogoutOutlined />}>
                    ออกจากระบบ
                </Menu.Item>
            </Menu>
        </>
    )
}

export default MenuList
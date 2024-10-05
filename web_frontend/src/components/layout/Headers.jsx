import React from 'react'
import {Button, Layout, theme} from 'antd'
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'

const {Header} = Layout

function Headers({collapsed, setCollapsed}) {

    const {
        token: {colorBgContainer}
    } = theme.useToken()

  return (
    <>
        <Header style={{padding:0, background: colorBgContainer}}>
            <Button 
                type='text'
                className='toggle'
                onClick={()=> setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
        </Header>
    </>
  )
}

export default Headers
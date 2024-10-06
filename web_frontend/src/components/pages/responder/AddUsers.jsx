import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Layout, theme, Form, Table, Input, Button, Modal, Select, DatePicker } from 'antd'
import Sider from '../../layout/Sidebar'
import Headers from '../../layout/Headers'
import {
  createUser,
  getListUsers,
  getUserByID,
  updateUser,
  resetPassword
} from '../../function/Auth'
import { getListHospitals } from '../../function/RequestData'
import { CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import dayTH from "dayjs/locale/th"
import buddhistEra from 'dayjs/plugin/buddhistEra'
import th from 'antd/es/date-picker/locale/th_TH'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify'
import {
  SettingFilled,
  ExclamationCircleFilled,
  EyeFilled,
  KeyOutlined,
  AppstoreAddOutlined,
  SearchOutlined
} from '@ant-design/icons'
import useTitle from '../../utills/useTitle'
dayjs.locale(dayTH);

dayjs.extend(buddhistEra);
const { Content } = Layout
const { TextArea } = Input

function AddUsers() {

  useTitle('เพิ่มผู้ใช้ระบบ')
  const { user } = useSelector((state) => ({ ...state }))
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formCreate] = Form.useForm()
  const [formEdit] = Form.useForm()
  const [formResetPWD] = Form.useForm()
  const [listUsers, setListUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState([])
  const [listHospitals, setListHospitals] = useState([])
  const [editData, setEditData] = useState([])
  const [editUsersModal, setEditUsersModal] = useState(false)
  const [addUsersModal, setAddUsersModal] = useState(false)
  const [resetPasswordModal, setResetPasswordModal] = useState(false)
  const [resetPWD, setResetPWD] = useState([])
  const cDate = new Date().toISOString().slice(0, 10);

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()


  //Get List Hospitals
  useEffect(() => {
    getListHospitals(user.token)
      .then(res => {
        setListHospitals(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const options = listHospitals.map((item) => ({
    value: item.hospital_code,
    label: item.hospital_name + ' [' + item.hospital_code + ']'
  }))

  useEffect(() => {
    formCreate.setFieldsValue({
      level: '1',
      d_create: dayjs(cDate)
    })
  })


  useEffect(() => {
    loadListUsers(user.token)
  }, [user.token])

  const loadListUsers = () => {
    setLoading(true)
    getListUsers(user.token)
      .then(res => {
        setListUsers(res.data)
        setSearchQuery(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }

  const handleFilter = (e) => {
    setSearchQuery(listUsers.filter(f => f.hospital_code.toLowerCase().includes(e.target.value) || f.fullname.toLowerCase().includes(e.target.value)))
  }

  const dataSource = searchQuery.map((item) => ({
    ...item,
    key: item.user_id,
    size: 13
  }))

  const columnFilter = [
    {
      title: 'ลำดับ',
      dataIndex: 'key',
      align: 'center',
      render: (key, record)=>
        <>
          <span style={{fontSize: record.size}}>{key}</span>
        </>
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'fullname',
      align: 'center',
      render: (fullname, record)=>
        <>
          <span style={{fontSize: record.size}}>{fullname}</span>
        </>
    },
    {
      title: 'ตำแหน่ง',
      dataIndex: 'job_position',
      align: 'center',
      render: (job_position, record)=>
        <>
          <span style={{fontSize: record.size}}>{job_position}</span>
        </>
    },
    {
      title: 'Level',
      dataIndex: 'level',
      align: 'center',
      render: (level,record) =>
        <>
          {
            level == '1'
              ? <span style={{ color: '#098703', fontSize: record.size }}>Responder</span>
              : level == '2'
                ? <span style={{ color: '#034b87', fontSize: record.size }}>Approver</span>
                : null
          }
        </>
    },
    {
      title: 'วันที่เพิ่ม',
      dataIndex: 'd_create',
      align: 'center',
      width: 100,
      render: (d_create, record) =>
        <>
          <span style={{fontSize: record.size}}>
          {dayjs(d_create).locale('th').format('DD MMM BB')}
          </span>          
        </>
    },
    {
      title: 'วันที่แก้ไข',
      dataIndex: 'd_update',
      align: 'center',
      render: (d_update, record) =>
        <>
          <span style={{fontSize: record.size}}>
          {dayjs(d_update).locale('th').format('DD MMM BB')}
          </span> 
        </>
    },
    {
      title: 'การจัดการ',
      align: 'center',
      render: (user_id, record) =>
        <>
          <Button
            size='small'
            onClick={() => showEditUsersModal(user_id)}
            style={{ color: '#ef8c16', fontSize: record.size }}
          >
            <SettingFilled /> Update
          </Button> &nbsp;
          <Button
            size='small'
            style={{ color: '#f2a319', fontSize: record.size }}
            onClick={() => showResetPasswordModal(user_id)}
          >
            <KeyOutlined /> ResetPWD
          </Button>
        </>
    },
  ]

  //Add User Modal
  const showAddUser = () => {
    setAddUsersModal(true)
  }


  const handleAddUser = (fieldValue) => {
    const values = {
      ...fieldValue,
      'd_create': fieldValue['d_create'].format('YYYY-MM-DD')
    }
    createUser(user.token, values)
      .then(res => {
        toast.success(res.data, { theme: 'colored' })
        setAddUsersModal(false)
        loadListUsers(user.token)
      })
      .catch(err => {
        console.log(err)
        setAddUsersModal(false)
      })
  }

  //Edit Users Modal
  const showEditUsersModal = (e) => {
    setEditUsersModal(true)
    getUserByID(user.token, e.user_id)
      .then(res => {
        setEditData(res.data[0])
      })
      .catch(err => {
        console.log(err)
      })
  }

  //Reset Password
  const showResetPasswordModal = (e) => {
    setResetPasswordModal(true)
    setResetPWD(e)
  }

  const handleresetPassword = (fieldValue) => {
    const values = {
      ...fieldValue,
      'd_update': fieldValue['d_update'].format('YYYY-MM-DD')
    }
    const token = user.token
    const id = resetPWD.user_id
    console.log('Values: ', values)
    resetPassword(token, id, values)
      .then(res => {
        toast.success(res.data, { theme: 'colored' })
        setResetPasswordModal(false)
        loadListUsers(token)
      })
      .catch(err => {
        console.log(err)
        setResetPasswordModal(false)
      })
  }

  useEffect(() => {
    formResetPWD.setFieldsValue({
      d_update: dayjs(cDate)
    })
  })

  const cancelModal = () => {
    setAddUsersModal(false)
    setEditUsersModal(false)
    setResetPasswordModal(false)
  }


  useEffect(() => {
    formEdit.setFieldsValue({
      user_id: editData.user_id,
      hospital_code: editData.hospital_code,
      hospital_name: editData.hospital_name,
      fullname: editData.fullname,
      job_position: editData.job_position,
      level: editData.level,
      username: editData.username,
      password: editData.password,
      d_create: dayjs(editData.d_create, 'YYYY-MM-DD'),
      d_update: dayjs(cDate, 'YYYY-MM-DD')
    })
  })

  const handleEditUser = (fieldValue) => {
    const values = {
      ...fieldValue,
      'd_create': fieldValue['d_create'].format('YYYY-MM-DD'),
      'd_update': fieldValue['d_update'].format('YYYY-MM-DD')
    }
    console.log(values)
    updateUser(user.token, editData.user_id, values)
      .then(res => {
        toast.success(res.data, { theme: 'colored' })
        setEditUsersModal(false)
        loadListUsers(user.token)
      })
      .catch(err => {
        setEditUsersModal(false)
        console.log(err)
      })
  }

  const handleFinishFailed = (errorInfo) => {
    console.log('Failed : ', errorInfo)
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
      <Layout>
        <ToastContainer />
        <Sider collapsed={collapsed} />
        <Layout>
          <Headers collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content
            className='content'
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <h3 className='text-center'>เพิ่มผู้ใช้งานระบบ Approve API ProviderID</h3>
            {
              loading
                ? <h3 className='text-center' style={{ marginTop: '30px' }}>กำลังโหลด...<CircularProgress /></h3>
                :
                <>
                  <div className='bg-white shadow border' style={{ marginTop: 20 }}>
                    <div className='row'>
                      <div className='col'>
                        <span
                          style={{
                            float: 'left',
                            marginLeft: 20,
                            marginTop: 22
                          }}
                        >
                          <span>จำนวนรายการทั้งหมด <b>{searchQuery.length}</b> รายการ</span> &nbsp;
                          <Button size='small' type='primary' onClick={() => showAddUser()}>
                            <AppstoreAddOutlined /> เพิ่มคำขอใช้
                          </Button>
                        </span>
                      </div>
                      <div className='col'>
                        <div
                          style={{
                            width: 300,
                            float: 'right',
                            marginTop: 15,
                            marginRight: 20
                          }}
                        >
                          <Input
                            placeholder='ค้นหาด้วยรหัสหน่วยบริการ หรือ ชื่อ-สกุล...'
                            onChange={handleFilter}
                            prefix={<SearchOutlined />}
                          />
                        </div>
                      </div>
                    </div>

                    <Table
                      style={{
                        margin: '10px'
                      }}
                      pagination={{ pageSize: 12 }}
                      columns={columnFilter}
                      dataSource={dataSource}
                      bordered
                      size='small'
                    />
                  </div>
                </>
            }
            {/* Modal create user */}
            <Modal
              title={<span><ExclamationCircleFilled style={{ color: 'green', fontSize: '20px' }} /> เพิ่มข้อมูลผู้ใช้งาน</span>}
              open={addUsersModal}
              onOk={formCreate.submit}
              onCancel={cancelModal}
              width={800}
              style={{ top: 20 }}
            >
              <Form
                name='formCreate'
                form={formCreate}
                layout='vertical'
                onFinish={handleAddUser}
                onFinishFailed={handleFinishFailed}
              >
                <hr />
                <div className='row'>
                  <div className='col'>
                    <Form.Item
                      name='hospital_code'
                      label={<b>หน่วยบริการ/บริษัท/หน่วยงาน</b>}
                      rules={[
                        {
                          required: true,
                          message: 'กรุณาระบุหน่วยบริการ'
                        }
                      ]}
                      style={{ marginBottom: '15px' }}
                      hasFeedback
                    >
                      <Select
                        showSearch
                        placeholder='กรุณาระบุหน่วยบริการ...'
                        options={options}
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
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
                      hasFeedback
                    >
                      <Input placeholder='กรุณาระบุชื่อ-สกุลผู้ใช้งาน...' />
                    </Form.Item>
                    <Form.Item
                      name='job_position'
                      label={<b>ตำแหน่ง</b>}
                      rules={[
                        {
                          required: true,
                          message: 'กรุณาระบุตำแหน่ง'
                        }
                      ]}
                      style={{ marginBottom: '15px' }}
                      hasFeedback
                    >
                      <Input placeholder='กรุณาระบุตำแหน่ง...' />
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
                          pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/,
                          message: 'Username ต้องเป็นภาษาอังกฤษ a-z A-Z 0-9 เท่านั้น!'
                        }
                      ]}
                      style={{ marginBottom: '15px' }}
                      hasFeedback
                    >
                      <Input placeholder='กรุณาระบุ Username...' />
                    </Form.Item>
                  </div>
                  <div
                    className='col'
                    style={{ borderLeft: '1px solid gray' }}
                  >
                    <Form.Item
                      name='password'
                      label={<b>Password</b>}
                      hasFeedback
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
                      name='confirm_password'
                      label={<b>Confirm password</b>}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'กรุณาระบุยืนยัน Password !'
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Password ไม่ตรงกัน!'));
                          },
                        })
                      ]}
                      style={{ marginBottom: '15px' }}
                    >
                      <Input.Password placeholder='ยืนยัน Password' />
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
                      hasFeedback
                    >
                      <Select
                        placeholder='กรุณาระบุ Level...'
                        options={[
                          {
                            value: '1',
                            label: <span style={{ color: '#098703' }}>Responder(1)</span>
                          },
                          {
                            value: '2',
                            label: <span style={{ color: '#034b87' }}>Approver(2)</span>
                          }
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
                      hasFeedback
                    >
                      <DatePicker locale={buddhistLocale} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  </div>
                </div>
              </Form>
            </Modal>

            {/* Modal Edit Data */}
            <Modal
              title={<span><ExclamationCircleFilled style={{ color: '#3383ff', fontSize: '20px' }} /> แก้ไขข้อมูลผู้ใช้งาน</span>}
              open={editUsersModal}
              onOk={formEdit.submit}
              onCancel={cancelModal}
              width={500}
              style={{ top: 20 }}
            >
              <Form
                name='formEdit'
                form={formEdit}
                layout='vertical'
                onFinish={handleEditUser}
                onFinishFailed={handleFinishFailed}
              >
                <hr />
                <Form.Item
                  name='hospital_code'
                  label={<b>หน่วยบริการ/บริษัท/หน่วยงาน</b>}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุหน่วยบริการ'
                    }
                  ]}
                  style={{ marginBottom: '15px' }}
                >
                  <Select
                    options={[
                      {
                        value: editData.hospital_code,
                        label: editData.hospital_name + ' [' + editData.hospital_code + ']'
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
                      message: 'กรุณาระบุชื่อ-นามสกุลผู้ใช้งาน'
                    }
                  ]}
                  style={{ marginBottom: '15px' }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='job_position'
                  label={<b>ตำแหน่ง</b>}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุตำแหน่ง'
                    }
                  ]}
                  style={{ marginBottom: '15px' }}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='username'
                  label={<b>Username</b>}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุ Username'
                    }
                  ]}
                  style={{ marginBottom: '15px' }}
                >
                  <Input />
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
                    options={[
                      {
                        value: '1',
                        label: <span style={{ color: '#098703' }}>Responder(1)</span>
                      },
                      {
                        value: '2',
                        label: <span style={{ color: '#034b87' }}>Approver(2)</span>
                      }
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
                  <DatePicker locale={buddhistLocale} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                  name='d_update'
                  label={<b>วันที่แก้ไข</b>}
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

            {/* Modal reset password */}
            <Modal
              title={<span><ExclamationCircleFilled style={{ color: '#f2a319', fontSize: '20px' }} /> Reset password</span>}
              open={resetPasswordModal}
              onOk={formResetPWD.submit}
              onCancel={cancelModal}
              width={300}
              style={{ top: 20 }}
            >
              <Form
                name='formResetPWD'
                form={formResetPWD}
                layout='vertical'
                onFinish={handleresetPassword}
                onFinishFailed={handleFinishFailed}
              >
                <hr />
                <Form.Item
                  name='password'
                  label={<b>Password</b>}
                  hasFeedback
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
                  name='confirm_password'
                  label={<b>Confirm password</b>}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุยืนยัน Password !'
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Password ไม่ตรงกัน!'));
                      },
                    })
                  ]}
                  style={{ marginBottom: '15px' }}
                >
                  <Input.Password placeholder='ยืนยัน Password' />
                </Form.Item>
                <Form.Item
                  name='d_update'
                  label={<b>วันที่ Reset password</b>}
                  rules={[
                    {
                      required: true,
                      message: 'กรุณาระบุวันที่ Reset password'
                    }
                  ]}
                  style={{ marginBottom: '15px' }}
                  hasFeedback
                >
                  <DatePicker locale={buddhistLocale} style={{ width: '100%' }} disabled />
                </Form.Item>
              </Form>
            </Modal>

          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default AddUsers
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Form, theme, Table, Input, Button, Modal, Select, DatePicker, Typography } from 'antd'
import Sider from '../../layout/Sidebar'
import Headers from '../../layout/Headers'
import { FolderAddOutlined, SearchOutlined, ExclamationCircleFilled, SettingFilled, AppstoreAddOutlined } from '@ant-design/icons'
import {
    getListHospitals,
    createProviderIDRequest,
    getListProviderIDRequest,
    getProviderIDRequestByID,
    updateProviderRequest
} from '../../function/RequestData'
import { CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import dayTH from "dayjs/locale/th"
import buddhistEra from 'dayjs/plugin/buddhistEra'
import th from 'antd/es/date-picker/locale/th_TH'
import { ToastContainer, toast } from 'react-toastify'
import useTitle from '../../utills/useTitle'
dayjs.locale(dayTH);

dayjs.extend(buddhistEra);
const { Content } = Layout
const { TextArea } = Input

function AddRequest() {

    useTitle('เพิ่มคำขอใช้ API')
    const { user } = useSelector((state) => ({ ...state }))
    const [collapsed, setCollapsed] = useState(false)
    const [formCreate] = Form.useForm()
    const [formEdit] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [listHospitals, setListHospitals] = useState([])
    const [listRequest, setListRequest] = useState([])
    const [searchQuery, setSearchQuery] = useState([])
    const [addRequestModal, setAddRequestModal] = useState(false)
    const [editRequestModal, setEditRequestModal] = useState(false)
    const [requestDetail, setRequestDetail] = useState([])
    const cDate = new Date().toISOString().slice(0, 10);

    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken()

    //Get List Hospitals
    useEffect(() => {
        getListHospitals(user.token)
            .then(res => {
                console.log(res.data)
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
        loadListRequest(user.token)
    }, [user.token])

    const loadListRequest = () => {
        setLoading(true)
        getListProviderIDRequest(user.token)
            .then(res => {
                setLoading(false)
                setListRequest(res.data)
                setSearchQuery(res.data)
                // console.log(res.data)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
            .finally(() => setLoading(false))
    }

    const handleFilter = (e) => {
        setSearchQuery(listRequest.filter(f => f.req_hospital_code.toLowerCase().includes(e.target.value)))
    }

    const dataSource = searchQuery.map((item) => ({
        ...item,
        key: item.req_id,
        size: 13,
    }))

    const columnFilter = [
        {
            title: 'Hcode',
            dataIndex: 'req_hospital_code',
            align: 'center',
            render: (req_hospital_code, record) =>
                <>
                    <span
                        style={{ fontSize: record.size }}
                    >
                        {req_hospital_code}
                    </span>
                </>
        },
        {
            title: 'หน่วยบริการ',
            dataIndex: 'hospital_name',
            align: 'center',
            render: (hospital_name, record) =>
                <>
                    <span
                        style={{ fontSize: record.size }}
                    >
                        {hospital_name}
                    </span>
                </>
        },
        {
            title: 'ชื่อ Service',
            dataIndex: 'req_service_name',
            align: 'center',
            render: (req_service_name, record) =>
                <>
                    <span
                        style={{ fontSize: record.size }}
                    >
                        {req_service_name}
                    </span>
                </>
        },
        {
            title: 'จุดประสงค์',
            dataIndex: 'req_objective',
            align: 'center',
            render: (req_objective, record) =>
                <>
                    <span
                        style={{ fontSize: record.size }}
                    >
                        {req_objective}
                    </span>
                </>
        },
        {
            title: 'วันที่',
            dataIndex: 'req_date',
            align: 'center',
            width: 100,
            render: (req_date, record) =>
                <>
                    <span style={{ fontSize: record.size }}>
                        {dayjs(req_date).locale('th').format('DD MMM BB')}
                    </span>
                </>
        },
        {
            title: 'สถานะ',
            dataIndex: 'req_status',
            align: 'center',
            render: (req_status, record) =>
                <>
                    {
                        req_status == '1'
                            ? <span style={{ color: '#ffc733',fontSize: record.size }}>กำลังดำเนินการ</span>
                            : req_status == '2'
                                ? <span style={{ color: '#3383ff',fontSize: record.size }}>เพิ่ม Client ID & Secret key แล้ว</span>
                                : req_status == '3'
                                    ? <span style={{ color: 'green',fontSize: record.size }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                                    : req_status == '4'
                                        ? <span style={{ color: '#c72d00',fontSize: record.size }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
                                        : ''
                    }
                </>
        },
        {
            title: 'การจัดการ',
            align: 'center',
            render: (req_id) =>
                <>
                    <Button
                        size='small'
                        onClick={() => showEditModal(req_id)}
                        style={{ color: '#ef8c16', fontSize: 13 }}
                    >
                        <SettingFilled /> แก้ไข
                    </Button>
                </>
        }
    ]

    useEffect(() => {
        formCreate.setFieldsValue({
            req_detail_profile_data: '- ล็อกอิน\n- ชุดข้อมูล Health & Provider ID',
            req_detail_job: '- ตำแหน่ง\n- สังกัดวิชาชีพ,สังกัดหน่วยงาน',
            req_status: '1',
            req_date: dayjs(cDate)
        })
    })

    const showAddRequest = () => {
        setAddRequestModal(true)
        formCreate.resetFields()
    }

    const handleAddRequestData = (fieldValue) => {
        const values = {
            ...fieldValue,
            'req_date': fieldValue['req_date'].format('YYYY-MM-DD')
        }
        console.log(user.token, values)
        createProviderIDRequest(user.token, values)
            .then(res => {
                toast.success(res.data)
                setAddRequestModal(false)
                loadListRequest(user.token)
            })
            .catch(err => {
                toast.dismiss('การบันทึกข้อมูลล้มเหลว!')
                console.log(err)
            })
    }

    const showEditModal = (e) => {
        setEditRequestModal(true)
        getProviderIDRequestByID(user.token, e.req_id)
            .then(res => {
                setRequestDetail(res.data[0])
            })
            .catch(err => {
                console.log(err)
            })
    }

    const cancelModal = () => {
        setEditRequestModal(false)
        setAddRequestModal(false)
    }

    useEffect(() => {
        formEdit.setFieldsValue({
            req_id: requestDetail.req_id,
            req_hospital_code: requestDetail.req_hospital_code,
            hospital_name: requestDetail.hospital_name,
            req_date: dayjs(requestDetail.req_date, 'YYYY-MM-DD'),
            req_service_name: requestDetail.req_service_name,
            req_public_ip: requestDetail.req_public_ip,
            req_redirect_url: requestDetail.req_redirect_url,
            req_objective: requestDetail.req_objective,
            req_email: requestDetail.req_email,
            req_detail_profile_data: requestDetail.req_detail_profile_data,
            req_detail_job: requestDetail.req_detail_job,
            req_status: requestDetail.req_status
        })
    })

    const handleEditData = (fieldValue) => {
        const values = {
            ...fieldValue,
            'req_date': fieldValue['req_date'].format('YYYY-MM-DD')
        }
        console.log(user.token, requestDetail.req_id, values)
        updateProviderRequest(user.token, requestDetail.req_id, values)
            .then(res => {
                toast.success(res.data)
                setEditRequestModal(false)
                loadListRequest(user.token)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed', errorInfo)
    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
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
                        <h3 className='text-center'><FolderAddOutlined /> เพิ่มคำขอใช้แพลตฟอร์ม</h3>
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
                                                    <Button size='small' type='primary' onClick={() => showAddRequest()}>
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
                                                        placeholder='ค้นหาด้วยรหัสหน่วยบริการ...'
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

                        {/* Modal Add Request Data */}
                        <Modal
                            title={<span><ExclamationCircleFilled style={{ color: 'green', fontSize: '20px' }} /> เพิ่มข้อมูลคำขอใช้ API ProviderID</span>}
                            open={addRequestModal}
                            onOk={formCreate.submit}
                            onCancel={cancelModal}
                            width={900}
                            style={{ top: 20 }}
                        >
                            <hr />
                            <Form
                                form={formCreate}
                                name='formCreate'
                                layout='vertical'
                                onFinish={handleAddRequestData}
                                onFinishFailed={onFinishFailed}
                            >
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Item
                                            name='req_hospital_code'
                                            label={<b>หน่วยบริการ :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุหน่วยบริการ'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
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
                                            name='req_service_name'
                                            label={<b>ชื่อ Service :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุชื่อ Service'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_public_ip'
                                            label={<b>Public IP :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Public IP'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_redirect_url'
                                            label={<b>Redirect URL :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Redirect URL'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_objective'
                                            label={<b>จุดประสงค์ :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุจุดประสงค์'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_email'
                                            label={<b>อีเมล :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุอีเมล'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <div className='col' style={{ borderLeft: '1px solid gray' }}>
                                        <Form.Item
                                            name='req_detail_profile_data'
                                            label={<b>รายละเอียด :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุรายละเอียด'
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_detail_job'
                                            label={<b>ข้อมูล Provider :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุข้อมูล Provider'
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_status'
                                            label={<b>สถานะคำขอ :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุสถานะคำขอ'
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <Select
                                                options={[
                                                    {
                                                        value: '1',
                                                        label: <span style={{ color: '#ffc733' }}>กำลังดำเนินการ</span>
                                                    },
                                                    {
                                                        value: '2',
                                                        label: <span style={{ color: '#3383ff' }}>เพิ่ม Client ID & Secret key แล้ว</span>
                                                    },
                                                    {
                                                        value: '3',
                                                        label: <span style={{ color: 'green' }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                                                    },
                                                    {
                                                        value: '4',
                                                        label: <span style={{ color: '#c72d00' }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_date'
                                            label={<b>วันที่ส่งคำขอ :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุวันที่ส่งคำขอ'
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <DatePicker
                                                locale={buddhistLocale}
                                                placeholder='กรุณาระบุวันที่...'
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </Modal>

                        {/* Modal Edit Data */}
                        <Modal
                            title={<span><ExclamationCircleFilled style={{ color: '#3383ff', fontSize: '20px' }} /> แก้ไขคำขอใช้ API ProviderID</span>}
                            open={editRequestModal}
                            onOk={formEdit.submit}
                            onCancel={cancelModal}
                            width={900}
                            style={{ top: 20 }}
                        >

                            <Form
                                form={formEdit}
                                name='formEdit'
                                layout='vertical'
                                onFinish={handleEditData}
                                onFinishFailed={onFinishFailed}
                            >
                                <hr />
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Item
                                            name='req_hospital_code'
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
                                                        value: requestDetail.req_hospital_code,
                                                        label: requestDetail.hospital_name + ' [' + requestDetail.req_hospital_code + ']'
                                                    }
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_service_name'
                                            label={<b>ชื่อ Service :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_public_ip'
                                            label={<b>Public IP :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_redirect_url'
                                            label={<b>Redirect URL :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_objective'
                                            label={<b>จุดประสงค์ :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_email'
                                            label={<b>อีเมล :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <div className='col' style={{ borderLeft: '1px solid gray' }}>
                                        <Form.Item
                                            name='req_detail_profile_data'
                                            label={<b>รายละเอียด :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_detail_job'
                                            label={<b>ข้อมูล Provider :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_status'
                                            label={<b>สถานะคำขอ :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <Select
                                                options={[
                                                    {
                                                        value: '1',
                                                        label: <span style={{ color: '#ffc733' }}>กำลังดำเนินการ</span>
                                                    },
                                                    {
                                                        value: '2',
                                                        label: <span style={{ color: '#3383ff' }}>เพิ่ม Client ID & Secret key แล้ว</span>
                                                    },
                                                    {
                                                        value: '3',
                                                        label: <span style={{ color: 'green' }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                                                    },
                                                    {
                                                        value: '4',
                                                        label: <span style={{ color: '#c72d00' }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_date'
                                            label={<b>วันที่ส่งคำขอ :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '15px' }}
                                        >
                                            <DatePicker locale={buddhistLocale} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default AddRequest
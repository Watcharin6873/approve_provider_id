import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Layout, Form, theme, Table, Input, Button, Modal, Select, DatePicker } from 'antd'
import Sider from '../../layout/Sidebar'
import Headers from '../../layout/Headers'
import { FolderAddOutlined, SearchOutlined, ExclamationCircleFilled, SettingFilled, AppstoreAddOutlined } from '@ant-design/icons'
import {
    getListProviderIDRequest,
    getProviderIDRequestByID,
    updateClientIDSecretKey
} from '../../function/RequestData'
import { CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import dayTH from "dayjs/locale/th"
import buddhistEra from 'dayjs/plugin/buddhistEra'
import th from 'antd/es/date-picker/locale/th_TH'
import { ToastContainer, toast } from 'react-toastify'
dayjs.locale(dayTH);

dayjs.extend(buddhistEra);
const { Content } = Layout
const { TextArea } = Input

function AddToken() {

    const { user } = useSelector((state) => ({ ...state }))
    const [collapsed, setCollapsed] = useState(false)
    const [formAddToken] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [listRequest, setListRequest] = useState([])
    const [searchQuery, setSearchQuery] = useState([])
    const [addTokenModal, setAddTokenModal] = useState(false)
    const [requestDetail, setRequestDetail] = useState([])
    const cDate = new Date().toISOString().slice(0, 10);

    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken()

    //Load list request token
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
        setSearchQuery(listRequest.filter(f => f.req_hospital_code.toLowerCase().includes(e.target.value) || f.hospital_name.toLowerCase().includes(e.target.value)))
    }

    const dataSource = searchQuery.map((item) => ({
        ...item,
        key: item.req_id
    }))

    const columnFilter = [
        {
            title: 'รหัสหน่วยบริการ',
            dataIndex: 'req_hospital_code',
            align: 'center',
        },
        {
            title: 'หน่วยบริการ',
            dataIndex: 'hospital_name',
            align: 'center'
        },
        {
            title: 'ชื่อ Service',
            dataIndex: 'req_service_name',
            align: 'center'
        },
        {
            title: 'จุดประสงค์',
            dataIndex: 'req_objective',
            align: 'center'
        },
        {
            title: 'วันที่',
            dataIndex: 'req_date',
            align: 'center',
            render: (req_date) =>
                <>
                    {dayjs(req_date).locale('th').format('DD MMM BB')}
                </>
        },
        {
            title: 'สถานะ',
            dataIndex: 'req_status',
            align: 'center',
            render: (req_status) =>
                <>
                    {
                        req_status == '1'
                            ? <span style={{ color: '#ffc733' }}>กำลังดำเนินการ</span>
                            : req_status == '2'
                                ? <span style={{ color: '#3383ff' }}>เพิ่ม Client ID & Secret key แล้ว</span>
                                : req_status == '3'
                                    ? <span style={{ color: 'green' }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                                    : req_status == '4'
                                        ? <span style={{ color: '#c72d00' }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
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
                        onClick={() => showAddTokenModal(req_id)}
                        style={{ color: '#ef8c16' }}
                    >
                        <SettingFilled /> เพิ่ม Token
                    </Button>
                </>
        }
    ]

    const showAddTokenModal = (e) => {
        setAddTokenModal(true)
        const id = e.req_id
        getProviderIDRequestByID(user.token, id)
            .then(res => {
                setRequestDetail(res.data[0])
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        formAddToken.setFieldsValue({
            req_id: requestDetail.req_id,
            req_hospital_code: requestDetail.req_hospital_code,
            hospital_name: requestDetail.hospital_name,
            req_service_name: requestDetail.req_service_name,
            req_public_ip: requestDetail.req_public_ip,
            req_redirect_url: requestDetail.req_redirect_url,
            req_objective: requestDetail.req_objective,
            req_email: requestDetail.req_email,
            req_detail_profile_data: requestDetail.req_detail_profile_data,
            req_detail_job: requestDetail.req_detail_job,
            req_date: dayjs(requestDetail.req_date, 'YYYY-MM-DD'),
            req_status: requestDetail.req_status,
            req_health_client_uat: requestDetail.req_health_client_uat,
            req_health_secret_uat: requestDetail.req_health_secret_uat,
            req_health_client_prd: requestDetail.req_health_client_prd,
            req_health_secret_prd: requestDetail.req_health_secret_prd,
            req_provider_client_uat: requestDetail.req_provider_client_uat,
            req_provider_secret_uat: requestDetail.req_provider_secret_uat,
            req_provider_client_prd: requestDetail.req_provider_client_prd,
            req_provider_secret_prd: requestDetail.req_provider_secret_prd,
            req_date_input_token: dayjs(cDate)
        })
    })

    const cancelModal = () => {
        setAddTokenModal(false)
    }

    const handleAddToken = (fielValue) => {
        const values = {
            ...fielValue,
            'req_date_input_token': fielValue['req_date_input_token'].format('YYYY-MM-DD')
        }
        console.log(values)
        updateClientIDSecretKey(user.token, requestDetail.req_id, values)
            .then(res=>{
                toast.success(res.data, {
                    theme:'colored'
                })
                setAddTokenModal(false)
                loadListRequest(user.token)
            })
            .catch(err=>{
                toast.error(err)
                console.log(err)
            })
    }

    const onFinishFailed = (errorInfo) => {
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
                        <h3 className='text-center'>เพิ่ม Clinent ID & Secret key</h3>
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
                                                    <span>จำนวนรายการทั้งหมด <b>{searchQuery.length}</b> รายการ</span>
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
                                                        placeholder='ค้นหาด้วยรหัสหน่วยบริการ หรือ ชื่อหน่วยบริการ...'
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
                        <Modal
                            title={<span><ExclamationCircleFilled style={{ color: 'green', fontSize: '20px' }} /> เพิ่ม Clinent ID & Secret key</span>}
                            open={addTokenModal}
                            onOk={formAddToken.submit}
                            onCancel={cancelModal}
                            width={900}
                            style={{ top: 20 }}
                        >
                            <hr />

                            <Form
                                name='formAddToken'
                                form={formAddToken}
                                layout='vertical'
                                onFinish={handleAddToken}
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
                                                options={[
                                                    {
                                                        value: requestDetail.req_hospital_code,
                                                        label: requestDetail.hospital_name + ' [' + requestDetail.req_hospital_code + ']'
                                                    }
                                                ]}
                                                disabled
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
                                            <Input disabled />
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
                                            <Input disabled />
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
                                            <Input disabled />
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
                                            <Input disabled />
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
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_detail_profile_data'
                                            label={<b>รายละเอียดคำขอใช้ :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '13px' }}
                                        >
                                            <TextArea rows={3} disabled />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_detail_job'
                                            label={<b>รายละเอียดเกี่ยวกับงาน :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '13px' }}
                                        >
                                            <TextArea disabled />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_date'
                                            label={<b>วันที่ส่งคำขอ :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <DatePicker
                                                locale={buddhistLocale}
                                                style={{ width: '100%' }}
                                                disabled
                                            />
                                        </Form.Item>
                                    </div>
                                    <div
                                        className='col'
                                        style={{ borderLeft: '1px solid #000' }}
                                    >
                                        <Form.Item
                                            name='req_status'
                                            label={<b>สถานะคำขอ :</b>}
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
                                                        value: '1',
                                                        label: <span style={{ color: '#ffc733' }}>กำลังดำเนินการ</span>
                                                    },
                                                    {
                                                        value: '2',
                                                        label: <span style={{ color: '#3383ff' }}>เพิ่ม Client ID & Secret key แล้ว</span>
                                                    }
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_health_client_uat'
                                            label={<b>Health ID Client ID UAT :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Health ID Client ID UAT'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_health_secret_uat'
                                            label={<b>Health ID Secret key UAT :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Health Secret key UAT'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_health_client_prd'
                                            label={<b>Health ID Client ID PRD :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Health ID Client ID PRD'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_health_secret_prd'
                                            label={<b>Health ID Secret key PRD :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Health Secret key PRD'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_provider_client_uat'
                                            label={<b>Provider ID Client ID UAT :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Provider ID Client ID UAT'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_provider_secret_uat'
                                            label={<b>Provider ID Secret key UAT :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Provider ID Secret key UAT'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_provider_client_prd'
                                            label={<b>Provider ID Client ID PRD :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Provider ID Client ID PRD'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_provider_secret_prd'
                                            label={<b>Provider ID Secret key PRD :</b>}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'กรุณาระบุ Provider Secret key PRD'
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            name='req_date_input_token'
                                            label={<b>วันที่เพิ่ม Token :</b>}
                                            rules={[
                                                {
                                                    required: true
                                                }
                                            ]}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <DatePicker
                                                locale={buddhistLocale}
                                                style={{ width: '100%' }}
                                            />
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

export default AddToken
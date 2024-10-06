import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button, Input, Layout, Modal, Table, theme } from 'antd'
import Sider from '../../layout/Sidebar'
import Headers from '../../layout/Headers'
import {
  getListProviderIDRequest,
  getProviderIDRequestByID
} from '../../function/RequestData'
import { CircularProgress } from '@mui/material'
import dayjs from 'dayjs'
import "dayjs/locale/th"
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { ExclamationCircleFilled, EyeTwoTone } from '@ant-design/icons'
import { SearchOutlined } from '@mui/icons-material'
import useTitle from '../../utills/useTitle'

dayjs.extend(buddhistEra);
const { Content } = Layout

function HomeApprover() {

  useTitle('หน้าแรก')
  const { user } = useSelector((state) => ({ ...state }))
  const [collapsed, setCollapsed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [listRequest, setListRequest] = useState([])
  const [searchQuery, setSearchQuery] = useState([])
  const [detailModal, setDetailModal] = useState(false)
  const [requestDetail, setRequestDetail] = useState([])

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()

  useEffect(() => {
    loadListData(user.token)
  }, [user.token])

  const loadListData = () => {
    setLoading(true)
    getListProviderIDRequest(user.token)
      .then(res => {
        setListRequest(res.data)
        setSearchQuery(res.data)
        setLoading(false)
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
    size: 13
  }))

  const columnFilter = [
    {
      title: 'Hcode',
      dataIndex: 'req_hospital_code',
      align: 'center',
      render: (req_hospital_code, record)=>
        <>
          <span style={{fontSize: record.size}}>{req_hospital_code}</span>
        </>
    },
    {
      title: 'หน่วยบริการ',
      dataIndex: 'hospital_name',
      align: 'center',
      render: (hospital_name, record)=>
        <>
          <span style={{fontSize: record.size}}>{hospital_name}</span>
        </>
    },
    {
      title: 'ชื่อ Service',
      dataIndex: 'req_service_name',
      align: 'center',
      render: (req_service_name, record)=>
        <>
          <span style={{fontSize: record.size}}>{req_service_name}</span>
        </>
    },
    {
      title: 'จุดประสงค์',
      dataIndex: 'req_objective',
      align: 'center',
      render: (req_objective, record)=>
        <>
          <span style={{fontSize: record.size}}>{req_objective}</span>
        </>
    },
    {
      title: 'วันที่',
      dataIndex: 'req_date',
      align: 'center',
      width: 100,
      render: (req_date, record) =>
        <>
          <span style={{fontSize: record.size}}>
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
              ? <span style={{ color: '#ffc733', fontSize: record.size }}>กำลังดำเนินการ</span>
              : req_status == '2'
                ? <span style={{ color: '#3383ff', fontSize: record.size }}>เพิ่ม Client ID & Secret key แล้ว</span>
                : req_status == '3'
                  ? <span style={{ color: 'green', fontSize: record.size }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                  : req_status == '4'
                    ? <span style={{ color: '#c72d00', fontSize: record.size }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
                    : ''
          }
        </>
    },
    {
      title: 'ดูรายละเอียด',
      align: 'center',
      render: (req_id) =>
        <>
          <Button type='link' size='small' onClick={() => showDetailModal(req_id)}>
            <EyeTwoTone style={{ fontSize: '16px' }} />
          </Button>
        </>
    }
  ]

  const showDetailModal = (e) => {
    setDetailModal(true)
    getProviderIDRequestByID(user.token, e.req_id)
      .then(res => {
        console.log(res.data)
        setRequestDetail(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const cancelModal = () => {
    setDetailModal(false)
  }

  const detailData = requestDetail.map((item) => ({
    ...item,
    key: item.req_id
  }))

  const requestStatus = detailData.map((item) => item.req_status)

  return (
    <>
      <Layout>
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
            <h3 className='text-center'>รายการผู้ขอใช้ API ProviderID</h3>
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
            <Modal
              title={<span><ExclamationCircleFilled style={{ color: '#0573e8', fontSize: '20px' }} /> รายละเอียดคำขอใช้ API ProviderID</span>}
              open={detailModal}
              onCancel={cancelModal}
              width={500}
              footer={[
                <Button onClick={cancelModal} type='primary' danger>ปิด</Button>
              ]}
              style={{top: 20}}
            >
              <hr style={{ border: 'dotted 1px' }} />
              <span><b>หน่วยบริการ : </b> {detailData.map((item) => item.hospital_name)} [{detailData.map((item) => item.req_hospital_code)}]</span><br />
              <span><b>ชื่อ Service : </b> {detailData.map((item) => item.req_service_name)}</span><br />
              <span><b>Public IP : </b> {detailData.map((item) => item.req_public_ip)}</span><br />
              <span><b>Redirect URL : </b> {detailData.map((item) => item.req_redirect_url)}</span><br />
              <span><b>จุดประสงค์ : </b> {detailData.map((item) => item.req_objective)}</span><br />
              <span><b>Email : </b> {detailData.map((item) => item.req_email)}</span><br />
              <span><b>ชุดข้อมูลที่ต้องการ : </b> {detailData.map((item) => item.req_detail_profile_data)}</span><br />
              <span><b>ข้อมูลการทำงาน : </b> {detailData.map((item) => item.req_detail_job)}</span><br />
              <span><b>วันที่ลงทะเบียนขอ : </b> {detailData.map((item) => dayjs(item.req_date).locale('th').format('DD MMMM BBBB'))}</span><br />
              <span><b>สถานะคำขอ : </b> {
                requestStatus == '1'
                  ? <span style={{ color: '#ffc733' }}>กำลังดำเนินการ</span>
                  : requestStatus == '2'
                    ? <span style={{ color: '#3383ff' }}>เพิ่ม Client ID & Secret key แล้ว</span>
                    : requestStatus == '3'
                      ? <span style={{ color: '#0e6655' }}>ส่ง Client ID & Secret key ทางอีเมลแล้ว</span>
                      : requestStatus == '4'
                        ? <span style={{ color: '#c72d00' }}>ยกเลิก Client ID & Secret key นี้แล้ว</span>
                        : ''
              }</span><br />
              <hr />
              <div className='div-center'>
                <span style={{ color: '#935116' }}><u><b>วันที่ส่ง Client ID & Secret key : </b> {detailData.map((item) => dayjs(item.req_date_input_token).locale('th').format('DD MMMM BBBB'))}</u></span>
              </div>
              <div style={{ color: '#935116' }}>
                <span><b>Client ID และ Secret Key ของ Health ID</b> เพื่อใช้ในเอกสาร ส่วนที่ 1</span><br />
                <span><u><b>UAT</b></u></span><br />
                <span><b>ClientID : </b> {detailData.map((item) => item.req_health_client_uat)}</span><br />
                <span><b>Secret key : </b>  {detailData.map((item) => item.req_health_secret_uat)}</span><br />
                <span><u><b>PRD</b></u></span><br />
                <span><b>ClientID : </b> {detailData.map((item) => item.req_health_client_prd)}</span><br />
                <span><b>Secret key : </b> {detailData.map((item) => item.req_health_secret_prd)}</span>
              </div>
              <hr />
              <div style={{ color: '#21618c' }}>
                <span><b>Client ID และ Secret Key ของ Provider ID</b> เพื่อใช้ในเอกสาร ส่วนที่ 2</span><br />
                <span><u><b>UAT</b></u></span><br />
                <span><b>ClientID : </b> {detailData.map((item) => item.req_provider_client_uat)}</span><br />
                <span><b>Secret key : </b> {detailData.map((item) => item.req_provider_secret_uat)}</span><br />
                <span><u><b>PRD</b></u></span><br />
                <span><b>ClientID : </b> {detailData.map((item) => item.req_provider_client_prd)}</span><br />
                <span><b>Secret key : </b> {detailData.map((item) => item.req_provider_secret_prd)}</span>
              </div>
              <hr />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default HomeApprover
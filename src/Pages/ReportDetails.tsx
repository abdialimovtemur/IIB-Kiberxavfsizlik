import { useEffect, useState } from 'react';
import { Card, Row, Col, Descriptions, Button, Space, message, Upload, Modal, Form, Input, InputNumber } from 'antd';
import { DownloadOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports.service';
import { Crime, File } from '../types/api.types';
import type { UploadFile } from 'antd/es/upload/interface';

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Crime | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchReportDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await reportsService.getReportById(Number(id));
      setReport(data);
      if (data.files) {
        setFileList(data.files.map((file: File) => ({
          uid: file.id.toString(),
          name: file.name,
          status: 'done',
          url: file.file
        })));
      }
    } catch (error) {
      message.error('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const handleDownload = async () => {
    try {
      const blob = await reportsService.exportReportPdf(Number(id));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error('Yuklab olishda xatolik');
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file as any);
      await reportsService.uploadFile(Number(id), formData);
      message.success('Fayl yuklandi');
      fetchReportDetails();
    } catch (error) {
      message.error('Fayl yuklashda xatolik');
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(report);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await reportsService.deleteReport(Number(id));
      message.success('Hisobot o\'chirildi');
      navigate('/reports');
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await reportsService.updateReport(Number(id), values);
      message.success('Hisobot yangilandi');
      setIsModalVisible(false);
      fetchReportDetails();
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  return (
    <Card
      title="Hisobot ma'lumotlari"
      loading={loading}
      extra={
        <Space>
          <Button onClick={() => navigate('/reports')}>
            Orqaga
          </Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            PDF
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Tahrirlash
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            O'chirish
          </Button>
        </Space>
      }
    >
      {report && (
        <>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Bo'lim">{report.department}</Descriptions.Item>
            <Descriptions.Item label="Sana">{report.date}</Descriptions.Item>
            <Descriptions.Item label="Terrorism">{report.terrorism}</Descriptions.Item>
            <Descriptions.Item label="Atheism">{report.atheism}</Descriptions.Item>
            <Descriptions.Item label="Noqonuniy qurol">{report.illegal_weapon}</Descriptions.Item>
            <Descriptions.Item label="Odam savdosi">{report.human_trafficking}</Descriptions.Item>
            <Descriptions.Item label="Narkotik">{report.narcotic}</Descriptions.Item>
            <Descriptions.Item label="Subkultura">{report.subculture}</Descriptions.Item>
            <Descriptions.Item label="Zo'ravonlik">{report.violence}</Descriptions.Item>
            <Descriptions.Item label="Pornografiya">{report.pornography}</Descriptions.Item>
            <Descriptions.Item label="Mining">{report.mining}</Descriptions.Item>
            <Descriptions.Item label="Crypto">{report.crypto}</Descriptions.Item>
            <Descriptions.Item label="IMEI">{report.imei}</Descriptions.Item>
            <Descriptions.Item label="Pentesting">{report.pentesting}</Descriptions.Item>
            <Descriptions.Item label="Gateway">{report.gateway}</Descriptions.Item>
            <Descriptions.Item label="Virus">{report.virus}</Descriptions.Item>
            <Descriptions.Item label="Qimor">{report.gambling}</Descriptions.Item>
            <Descriptions.Item label="Soxta savdo">{report.fake_trading}</Descriptions.Item>
            <Descriptions.Item label="Darknet">{report.darknet}</Descriptions.Item>
          </Descriptions>

          <Card title="Fayllar" style={{ marginTop: 16 }}>
            <Upload
              fileList={fileList}
              customRequest={({ file }) => handleUpload(file as File)}
              multiple
            >
              <Button icon={<UploadOutlined />}>Fayl yuklash</Button>
            </Upload>
          </Card>

          <Modal
            title="Hisobotni tahrirlash"
            open={isModalVisible}
            onOk={form.submit}
            onCancel={() => setIsModalVisible(false)}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item name="date" label="Sana" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="terrorism" label="Terrorism" rules={[{ required: true }]}>
                <InputNumber min={0} />
              </Form.Item>
              <Form.Item name="atheism" label="Atheism" rules={[{ required: true }]}>
                <InputNumber min={0} />
              </Form.Item>
              {/* ... other fields ... */}
            </Form>
          </Modal>
        </>
      )}
    </Card>
  );
};

export default ReportDetails; 
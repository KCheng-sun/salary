import React from 'react';
import { Space, Table, Tag, ConfigProvider,Empty,Button,message, Upload } from 'antd';
import type { TableProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd'
import * as XLSX from 'xlsx';
import { useState } from 'react';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
  },
];
const data1: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const UserTable: React.FC = () => {

  const [data, setData] = useState<DataType[]>([]);

  const uploadProps: UploadProps = {
    name: 'file',
    action: '#',
    beforeUpload(file) {
      // 若file为excel文件，则进行解析
      if (file.type === 'application/vnd.ms-excel') {
        // 解析excel文件
        const reader = new FileReader();
        reader.onload = (e) => {
          if(e.target != null && e.target.result != null){
            let fileData;
            if (typeof e.target.result === 'string') {
              const encodedData = new TextEncoder().encode(e.target.result);
              fileData = new Uint8Array(encodedData.buffer);
            } else {
              fileData = new Uint8Array(e.target.result);
            }
            const workbook = XLSX.read(fileData, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setData(data1);
          }
        };
        reader.readAsArrayBuffer(file);
      }else{
        message.error('请上传excel文件');
      }
      return false;
    },
  };
  const customizeRenderEmpty = () => {
    //这里面就是我们自己定义的空状态
    return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={'导入数据'}
    >
      <Upload {...uploadProps}>
        <Button type="primary" icon={<UploadOutlined />}>选择上传文件</Button>
      </Upload>
    </Empty>
    )
  };
  return (
  <ConfigProvider renderEmpty={customizeRenderEmpty}> 
      <Table columns={columns} dataSource={data} pagination={false} />
    </ConfigProvider>)
}

export default UserTable;
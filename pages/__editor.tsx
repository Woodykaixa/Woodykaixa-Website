import type { NextPage } from 'next';
import { Input, Typography, Button, Form } from 'antd';
import Markdown from 'markdown-to-jsx';
import { MarkdownOptions } from '@/config/markdown';
import { useState } from 'react';
import { File, OK, Oss } from '@/dto';

const EditorPage: NextPage = () => {
  const [form] = Form.useForm<{ name: string; content: string; auth: string }>();
  const [t, setT] = useState('');
  const get = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/get-file?name=' + form.getFieldsValue().name)
      .then(async res => {
        if (res.status === OK.code) {
          return (await res.json()) as Oss.GetFileResp;
        }
        throw new Error('');
      })
      .then(json => {
        form.setFieldsValue({
          content: json.content,
        });
        setT(json.content);
      })
      .catch(console.error);
  };

  const put = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/put-or-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...form.getFieldsValue(), encoding: 'utf8', type: 'POST' } as File.PutFileDTO),
    }).then(() => {
      setT(form.getFieldsValue().content);
    });
  };

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        className='items-center p-4 max-w-5xl w-full'
        form={form}
        initialValues={{ content: '12' }}
      >
        <Form.Item name='name'>
          <Input></Input>
        </Form.Item>
        <Form.Item name='auth'>
          <Input></Input>
        </Form.Item>
        <div className='flex'>
          <Typography className='w-1/2'>
            <Form.Item name='content'>
              <Input.TextArea rows={30}></Input.TextArea>
            </Form.Item>
          </Typography>
          <div className='w-1/2'>
            <Markdown options={MarkdownOptions}>{t}</Markdown>
          </div>
        </div>
        <Button onClick={get}>get</Button>
        <Button onClick={put}>post</Button>
      </Form>
    </div>
  );
};

export default EditorPage;

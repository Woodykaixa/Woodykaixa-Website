import type { NextPage } from 'next';
import { Input, Typography, Button, Form } from 'antd';
import Markdown from 'markdown-to-jsx';
import { IndexOptions } from '@/config/markdown';
import { useState } from 'react';

const Me: NextPage = () => {
  const [form] = Form.useForm<{ name: string; content: string }>();
  const [t, setT] = useState('');
  const get = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/get?name=' + form.getFieldsValue().name)
      .then(res => res.json())
      .then(json => {
        form.setFieldsValue({
          content: json.content,
        });
        setT(json.content);
      });
  };

  const put = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/put', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.getFieldsValue()),
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
            <Markdown options={IndexOptions}>{t}</Markdown>
          </div>
        </div>
        <Button onClick={get}>get</Button>
        <Button onClick={put}>post</Button>
      </Form>
    </div>
  );
};

export default Me;

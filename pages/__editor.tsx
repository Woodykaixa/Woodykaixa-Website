import type { NextPage } from 'next';
import { Input, Typography, Button, Form } from 'antd';
import Markdown from 'markdown-to-jsx';
import { MarkdownOptions } from '@/config/markdown';
import { useState } from 'react';
import { File, OK, Oss } from '@/dto';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThrottledInput } from '@/util/hooks';

const EditorPage: NextPage = () => {
  const [form] = Form.useForm<{ name: string; content: string; auth: string }>();
  const [content, setContent] = useThrottledInput('', 500);
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
        setContent(json.content);
      })
      .catch(console.error);
  };

  const put = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/put-or-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...form.getFieldsValue(),
        encoding: 'utf8',
        type: 'POST',
        content: content,
      } as File.PutFileDTO),
    });
  };

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        className='items-center p-4  w-full'
        form={form}
        initialValues={{ content: '12' }}
      >
        <Form.Item name='name' label='文件'>
          <Input></Input>
        </Form.Item>
        <Form.Item name='auth' label='密码'>
          <Input></Input>
        </Form.Item>
        <Form.Item label='actions'>
          <Button onClick={get}>get</Button>
          <Button onClick={put}>post</Button>
        </Form.Item>
        <div className='h-10'></div>
        <MarkdownEditor value={content} updateValue={setContent}></MarkdownEditor>
      </Form>
    </div>
  );
};

export default EditorPage;

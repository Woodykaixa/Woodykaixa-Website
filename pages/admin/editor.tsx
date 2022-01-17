import type { NextPage } from 'next';
import { Tag, Input, Tooltip, Typography, Button, Form, notification, message } from 'antd';
import Markdown from 'markdown-to-jsx';
import { MarkdownOptions } from '@/config/markdown';
import { useState, Component, useRef, FC, useMemo, useEffect } from 'react';
import { File, OK, Oss } from '@/dto';
import { MarkdownEditor } from '@/components/form/MarkdownEditor';
import { useThrottledInput } from '@/util/hooks';
import { KeywordEditor } from '@/components/form/KeywordEditor';

// const Tag = styled(AntdTag)`
//   & {
//     display: flex;
//     align-items: center;
//   }
// `;

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
    // fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/put-or-update', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ...form.getFieldsValue(),
    //     encoding: 'utf8',
    //     type: 'POST',
    //     content: content,
    //   } as File.PutFileDTO),
    // });
    console.log('form', form.getFieldsValue());
  };

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        autoComplete='on'
        className='items-center p-4  w-full'
        form={form}
        initialValues={{}}
      >
        <Form.Item name='title' label='标题'>
          <Input></Input>
        </Form.Item>
        <Form.Item name='keywords' label='标签'>
          <KeywordEditor />
        </Form.Item>

        <Form.Item label='actions'>
          <Button onClick={get}>get</Button>
          <Button onClick={put}>post</Button>
        </Form.Item>
        <div className='h-10'></div>
        <Form.Item name='content' wrapperCol={{ span: 24 }}>
          <MarkdownEditor></MarkdownEditor>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditorPage;

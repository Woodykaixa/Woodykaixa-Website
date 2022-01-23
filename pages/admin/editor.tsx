import type { NextPage } from 'next';
import { Input, Button, Form, message, Switch } from 'antd';
import { File, OK, Oss, Blog, Err } from '@/dto';
import { MarkdownEditor, EditorTabType, ImageReferenceContext } from '@/components/form/MarkdownEditor';
import { useThrottledInput } from '@/util/hooks';
import { KeywordEditor } from '@/components/form/KeywordEditor';
import { useRef, useState } from 'react';
import { uniq } from 'lodash';

const EditorPage: NextPage = () => {
  const [form] = Form.useForm<Omit<Blog.AddDTO, 'referencedImages'>>();
  const [tab, setTab] = useState<EditorTabType>('text');
  const get = () => {
    // fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/file/get-file?name=' + form.getFieldsValue().name)
    //   .then(async res => {
    //     if (res.status === OK.code) {
    //       return (await res.json()) as Oss.GetFileResp;
    //     }
    //     throw new Error('');
    //   })
    //   .then(json => {
    //     form.setFieldsValue({
    //       content: json.content,
    //     });
    //     setContent(json.content);
    //   })
    //   .catch(console.error);
  };
  const countImage = useRef<ImageReferenceContext>({ siteImages: [] });

  const createPost = (values: Omit<Blog.AddDTO, 'referencedImages'>) => {
    console.log('dto', {
      ...values,
      referencedImages: uniq(countImage.current.siteImages),
    });
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/blog/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        referencedImages: uniq(countImage.current.siteImages),
      } as Blog.AddDTO),
    })
      .then(res => {
        if (res.status === OK.code) {
          return res.json() as Promise<Blog.AddResp>;
        }
        throw res.json() as Promise<Err.CommonResp>;
      })
      .then(resp => {
        message.success('发布成功');
        console.log(resp);
      })
      .catch(async err => {
        message.error('发布失败');
        console.error(await err);
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
        onFinish={createPost}
        initialValues={{
          content: '',
          hasCover: false,
        }}
      >
        <Form.Item name='title' label='标题'>
          <Input></Input>
        </Form.Item>
        <Form.Item name='hasCover' label='使用第一张图作为封面'>
          <Switch></Switch>
        </Form.Item>
        <Form.Item name='keywords' label='标签'>
          <KeywordEditor />
        </Form.Item>

        <Form.Item label='actions'>
          <Button onClick={get}>get</Button>
          <Button htmlType={'submit'} disabled={tab === 'text'}>
            post
          </Button>
        </Form.Item>
        <div className='h-10'></div>
        <Form.Item name='content' wrapperCol={{ span: 24 }}>
          <MarkdownEditor tab={tab} setTab={setTab} context={countImage.current}></MarkdownEditor>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditorPage;

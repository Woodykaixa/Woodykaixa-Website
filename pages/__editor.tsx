import type { NextPage } from 'next';
import { Input, Typography, Button, Form } from 'antd';
const Me: NextPage = () => {
  const [form] = Form.useForm<{ name: string; content: string }>();
  const get = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/get?name=' + form.getFieldsValue().name)
      .then(res => res.json())
      .then(json => {
        form.setFieldsValue({
          content: json.content,
        });
      });
  };

  const put = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/oss/put', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.getFieldsValue()),
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
      >
        <Form.Item name='name'>
          <Input></Input>
        </Form.Item>
        <Typography>
          <Form.Item name='content'>
            <Input.TextArea rows={30}></Input.TextArea>
          </Form.Item>
        </Typography>
        <Button onClick={get}>get</Button>
        <Button onClick={put}>post</Button>
      </Form>
    </div>
  );
};

export default Me;

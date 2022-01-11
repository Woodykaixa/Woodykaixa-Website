import { AvatarUploader } from '@/components/AvatarUploader';
import { Button, Form } from 'antd';
import { User } from '@/dto';
const Login = () => {
  const [form] = Form.useForm<User.AddDTO>();
  return (
    <div className='flex flex-col'>
      <Form form={form}>
        <Form.Item name='avatar'>
          <AvatarUploader
            img='https://avatars.githubusercontent.com/u/22990333?v=4'
            width={250}
            height={250}
            form={form}
          ></AvatarUploader>
        </Form.Item>
      </Form>

      <Button
        onClick={() => {
          console.log(form.getFieldsValue());
        }}
      >
        asdfasdf
      </Button>
    </div>
  );
};

export default Login;

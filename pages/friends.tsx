import { SiteConfig } from '@/config/site';
import { OK, User } from '@/dto';
import { List, Avatar } from 'antd';
import type { GetServerSideProps, NextPage } from 'next';

const Friends: NextPage<ServerSideProps> = ({ friends }) => {
  return (
    <div className='bg-white min-h-40 p-6 flex flex-col items-center mt-8'>
      <div className=' w-3/4 '>
        <List
          itemLayout='vertical'
          size='large'
          dataSource={friends}
          renderItem={friend => {
            return (
              <div className='min-h-40 flex items-center' key={friend.id}>
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={friend.avatar} size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 80 }} />}
                    title={<a href={friend.blog}>{friend.name}</a>}
                    description={friend.blog}
                  />
                  {friend.bio}
                </List.Item>
              </div>
            );
          }}
        ></List>
      </div>
    </div>
  );
};

export default Friends;
type ServerSideProps = { friends: User.FriendListResp };
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const response = await fetch(SiteConfig.url + '/api/user/friend');
  const friends = await response.json();
  if (response.status !== OK.code) {
    return {
      props: {
        friends: [],
      },
    };
  }
  return {
    props: {
      friends: friends,
    },
  };
};

import { useEffect } from 'react';
import { GetServerSideProps, NextPage } from 'next';
const Login: NextPage = (query: any) => {
  console.log(query);
  return <div>login page</div>;
};

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { query } = ctx;
  if (ctx.query.error) {
    return {
      redirect: {
        destination: `/error?err=${query.error}&desc=${query.error_description}`,
        permanent: false,
      },
    };
  }
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code: query.code,
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      }),
    });
    const json = await response.json();
    console.log(json);
    if (json.error) {
      return {
        redirect: {
          destination: `/error?err=${json.error}&desc=${json.error_description}&se=true`,
          permanent: false,
        },
      };
    }
    return {
      props: json,
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: `/error?err=${err}&desc=err`,
        permanent: false,
      },
    };
  }
};

export default Login;

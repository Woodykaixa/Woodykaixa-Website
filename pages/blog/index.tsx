import type { GetServerSideProps, NextPage } from 'next';
const Blog: NextPage<{
  files: Array<{ path: string; type: string }>;
}> = ({ files }) => {
  return (
    <div className='flex flex-col'>
      You&apos;ve got these files in bucket:
      <ol>
        {files.map(f => (
          <li key={f.path}>
            <div className='flex flex-col ml-2'>
              <div>file: {f.path}</div>
              <div>type: {f.type}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Blog;

export const getServerSideProps: GetServerSideProps = async ctx => {
  const json = [
    {
      path: 'README.md',
      type: 'markdown',
    },
  ];
  if (Array.isArray(json)) {
    return {
      props: {
        files: json,
      },
    };
  } else {
    console.log(json);
    return {
      props: {
        files: [],
      },
    };
  }
};

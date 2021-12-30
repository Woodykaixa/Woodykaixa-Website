import type { NextPage, GetStaticProps } from 'next';
import { Typography } from 'antd';

const Home: NextPage<{
  build: Date;
  mode: typeof process.env.APP_ENV;
}> = props => {
  return (
    <div className='bg-white p-6 flex flex-col items-center mt-8'>
      <Typography className='w-1/2'>
        <Typography.Title>欢迎来到卡夏妙妙屋</Typography.Title>
        <Typography.Paragraph>
          太垃圾了吧~<br></br>
          你打游戏真的好垃圾啊，简直就是菜狗<br></br>
          我刚才看到你打游戏了，我们以后一起打好不好，一起打，一起做大牢！
        </Typography.Paragraph>
        <Typography.Title level={2}>关于我</Typography.Title>
        <Typography.Paragraph>
          Hi there👋，我是Woodykaixa，
          22岁，是学生。我知道这个名字不太好叫。没关系，我的称呼有很多，你可以叫我：卡夏（是的，
          这就是妙妙屋的由来）、喵爷、小墨（如果你跟我很熟），etc.
          <Typography.Text delete>（还有一些太羞耻了，我就不说了）</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph>
          就读于北京工业大学信息安全专业，2022 年毕(shi)业。虽然专业是信息安全，但是目前就业方向是前端开发，常用
          TypeScript、ES6+、Node.JS、React，也可以写 C/C++，在学 Rust。喜欢造轮子，项目大多托管在 Github 上。
        </Typography.Paragraph>
        <Typography.Title level={2}>做过的项目</Typography.Title>
        <Typography.Title level={3}>
          <Typography.Link href='https://github.com/Woodykaixa/BeDbg' target='_blank'>
            BeDBG
          </Typography.Link>
        </Typography.Title>
        <Typography.Paragraph>
          毕业设计项目。使用 Windows Debug API 实现的动态调试器。剩下的写毕设任务书的时候再编吧！
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <Typography.Link href='https://github.com/Woodykaixa/masm-code' target='_blank'>
            masm-code
          </Typography.Link>
        </Typography.Title>
        <Typography.Paragraph>
          用于学习教学需求的 VSCode 语言插件，基于 TextMate 语法实现了 8086 汇编的语法高亮，并集成了学校教学使用的
          DOSBox，一键编译运行。
        </Typography.Paragraph>
        <Typography.Title level={2}>关于我的其他信息</Typography.Title>
        <Typography.Paragraph>
          <ul className='list-none'>
            <li>本科: 北京工业大学信息安全专业</li>
            <li>硕士: 没考呢</li>
            <li>主前端开发，后端也写过 CURD (TypeScript, Node.js)</li>
            <li>其实吧，让我写 C++ 我也会一点</li>
            <li>Windows 用户 (装 WSL2 Ubuntu 算不算 Linux 用户？)</li>
            <li>6年云拉拉人 (全员推！) (人之初性本d，誰でも大好き!)</li>
          </ul>
        </Typography.Paragraph>
        <Typography.Title level={2}>关于本站</Typography.Title>
        <Typography.Paragraph>
          <Typography.Text delete>感觉应该没有多少人看过旧版本，所以补上了站点介绍。</Typography.Text>
        </Typography.Paragraph>
        <Typography.Title level={3}>来由</Typography.Title>
        <Typography.Paragraph>
          最初版本是作为选修课的大作业被制作出来的，使用的 React 和纯 CSS
          编写。本来打算作为博客和云文档使用，但是因为验收完成之后发现没有什么想表达的内容，所以最终搁置了。
        </Typography.Paragraph>
        <Typography.Paragraph>
          最近有了兴致，打算写一点东西，然后发现旧博客的种种问题，因此开始重构。
        </Typography.Paragraph>
        <Typography.Title level={3}>版本</Typography.Title>
        <Typography.Paragraph>
          以 {props.mode} 模式构建于 {props.build}
        </Typography.Paragraph>
      </Typography>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ctx => {
  const now = new Date();
  return {
    props: {
      build: `${now}`,
      mode: process.env.APP_ENV,
    },
  };
};

export default Home;

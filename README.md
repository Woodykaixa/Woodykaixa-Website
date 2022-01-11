# Woodykaixa Website

Refactor [my old website](https://woodykaixa.github.io).

## Motivation

### About my old website

My old website (Abbr. `old-site`) is my project for Web Design Course and deployed using Github Pages.  It has several
problems.

1. Github Pages serves my website as static files. I used react-router in old-site, however it causes 404 when I refresh browser.

2. When I develop old-site, I'm new to web development. There are many problems im my project. So I need a refactor.

3. To examine my css skills, I didn't use any UI framework. In fact, the UI of old-site is awful. And it's also hard to maintain.

4. Bad design everywhere.

5. No SSR support, which means visitors won't find my posts on search engines.

### About my new website

#### Functionality

1. A blog system to post my articles. 

    - [x] Markdown support
    - [ ] Comment system. 
    - [ ] Publish article from web page (Edit in web editor or select file from disk).

2. 
    - [x] User system based on GitHub OAuth2.

3. 
    - [ ] Access Control for Blog 
    > Removed. Grant OSS with `PublicRead`

#### Secondary object

1. Learning CI/CD, web deploying.
    We don't have unit test or e2e test. But integrated this repo with [Vercel for GitHub](https://vercel.com/docs/concepts/git/vercel-for-github).

2. Trying high-level frameworks
    Using Ant Design and Next.js, these frameworks saved a lot of time for me.

3. Work with cloud services.

    We store images and articles on [Ali OSS service](https://cn.aliyun.com/product/oss) and using a [cloud MongoDB](https://www.mongodb.com/atlas/database)

## PetalFM
A simple and delicate Music FM SPA built with react.

[![react](https://img.shields.io/badge/react-v16.2.0-blue.svg?longCache=true)](https://facebook.github.io/react/)
[![react-router](https://img.shields.io/badge/react--router-v4.2.2-blue.svg?longCache=true)](https://reacttraining.com/react-router/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Dependency Status](https://david-dm.org/alex1504/PetalFM/status.svg)](https://david-dm.org/alex1504/PetalFM)
[![MIT Licensed](https://img.shields.io/badge/License-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)

## Preview
The following pictures are interface display in wechat in IOS 8Plus device.
![preview](https://github.com/alex1504/PetalFM/raw/master/media/preview_1.jpg)
![preview](https://github.com/alex1504/PetalFM/raw/master/media/preview_2.jpg)
![preview](https://github.com/alex1504/PetalFM/raw/master/media/preview_3.jpg)
![preview](https://github.com/alex1504/PetalFM/raw/master/media/preview_4.jpg)

### Online Address
Visit http://fm.huzerui.com/, you can get better experience on mobile phones, sweep the qrcode below.
![qrcode](https://github.com/alex1504/PetalFM/raw/master/media/qrcode.png)

### Test Account
- Username: petalFM
- Password: petalFM

## Based on
![based on](https://github.com/alex1504/PetalFM/raw/master/media/main-based-on.png)

-  Framework: [react](https://facebook.github.io/react/)
-  State Management: [redux](https://redux.js.org/)
-  Bundler: [Webpack](http://webpack.github.io/docs/)，[Babel](https://babeljs.io)
-  Language: [ES2015](https://babeljs.io/docs/learn-es2015/), [Less](http://lesscss.org/)
-  Library:
  - [React Router V4](https://reacttraining.com/react-router/)
  - [Material-UI](https://material-ui-next.com/)
- Lint: [ESLint](http://eslint.org/)
- Icon Support: [Iconfont](http://www.iconfont.cn)

## Feature
* Material design style interface based on MaterialUI. The main color is pink tone.
* Using backend clouds (leancloud) to provide data services.
* Customize your exclusive FM by label preferences and collections.

## Function

- [x] Login, regist and logout
- [x] Customizing personal preference labels
- [x] High qualityFM, private FM, red heart FM channel for choice
- [x] Search songs, collect songs, download songs
- [x] Add songs to the trash bin or recycle songs from it
- [ ] Personal configuration, topic switching, etc.

## Redevelope
Pre work:
- Step1: Clone the project in local environment by command `git clone https://github.com/alex1504/PetalFM.git`
- Step2: Execute command `npm install`
- Step3: Regist an account in [https://leancloud.cn/](https://leancloud.cn/) and create an application in leancloud admin panel.
- Step4: Import database table in database directory and create a superuser in _User table in leancloud admin panel.
- Step5: Change `/src/services/config.js`

```javascript
export const APP_ID = 'YOUR APP_ID FOUND IN LEANCLOUD APP SETTING';
export const APP_KEY = 'YOUR APP_KEY FOUND IN LEANCLOUD APP SETTING';
export const SUPER_USER_OBJECT_ID = 'YOUR SUPERUSER ACCOUNT OBJECT ID';
```
Only the superadministrator can see the admin entrance, in which you can search and input a song and set song category.

Dev:
- Step6: Execute command `npm run dev`
- Step7: Redevelop the project.
- Step8: Execute command `npm run build` and view the optimised code in `/dist/` folder.

Deployment:
- Step9: Deploy: Make sure to proxy /api/ to http://music.163.com/api. In development you don't need to care about this for webpack-dev-server
has done which is config in package.json, but in deployment you need to make proxy by nginx or nodejs server.

## More
- Issues: [New an issues](https://github.com/alex1504/PetalFM/issues/new)
- Contact: Mailto: <a href="mailto:me@huzerui.com">me@huzerui.com</a>

## License
MIT © [alex1504](https://github.com/alex1504)

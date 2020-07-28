# FileComment

[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

## 사용법

app.js 에서 start 파라미터 변경 후 실행

```js
start({
  dir: BASE_PATH,
  filter: "hideLoading: function(val, option) {",
  ext: ".js",
  addStr: `
            /**
                * 로딩 Indicator 닫기.
                * @method hideLoading
                * @category Indicator
                * @param {string}  val 특정 ID를 가진 로딩 Indicator를 닫고 싶으면 지정. 기본 로딩 닫는 경우 안넣어도 됨.
                * @param {Object}  option 로딩에 전달할 객체.
                * @see
                * sfd.core.hideLoading() 참고.
            */
        `,
  fileFilters: ["Core.js"],
  tabNum: 2,
});
```

### License

fileComment is [MIT licensed](./LICENSE).

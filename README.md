# FileComment

[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

## 사용법

app.js 에서 start 파라미터 변경 후 실행

```js
start({
  dir: BASE_PATH,
  filter: "methodName: function(param1, param1\2) {",
  ext: ".js",
  addStr: `
    /**
        * 주석 설명 블라블라.
        * @method methodName
        * @category CategoryName
        * @param {string}  param1 is Foo
        * @param {Object}  param2 is FOO
        * @return {void}
    */
`,
  fileFilters: ["Core.js"],
  tabNum: 2,
});
```

### License

fileComment is [MIT licensed](./LICENSE).

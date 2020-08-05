# FileComment

[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

- FileComment 에서는 두가지 기능을 할 수 있습니다.

1. 주석 달기
2. 함수 삭제

## 1. 주석달기

### Parameters

#### functionName: start

| Name        |  Type  | script                       |
| ----------- | :----: | ---------------------------- |
| dir         | string | 검색할 Path                  |
| findStr     | string | 찾을 문자열                  |
| ext         | string | 확장자                       |
| addStr      | string | 넣을 주석                    |
| fileFilters | string | 검색할 파일명 대소문자 구분! |
| tabNum      | number | 추가할 탭 개수               |

### example

```js
const fileComment = require("./module/fileCommnet");
const BASE_PATH = "/Users/anminam/Documents/program";
fileComment.start({
  dir: BASE_PATH,
  findStr: "methodName: function(param1, param2) {",
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

## 2. 함수 삭제

### Parameters

#### functionName: start

| Name        |  Type  | script                       |
| ----------- | :----: | ---------------------------- |
| dir         | string | 검색할 Path                  |
| findStr     | string | 찾을 문자열                  |
| ext         | string | 확장자                       |
| fileFilters | string | 검색할 파일명 대소문자 구분! |

### example

```js
const removeFunction = require("./module/removeFunction");
const BASE_PATH = "/Users/anminam/Documents/program";

removeFunction.start({
  dir: BASE_PATH,
  findStr: "methodName: function() {",
  ext: ".js",
  // fileFilters: ["Core.js"],
});
```

## TEST

```
$ npm test
```

## License

fileComment is [MIT licensed](./LICENSE).

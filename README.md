# FileComment

[![npm version](https://badge.fury.io/js/file-comment.svg)](https://badge.fury.io/js/file-comment)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

- FileComment에서는 아래와 같은 기능을 할 수 있습니다.

1. 주석 달기
2. 함수 삭제

## 1. 주석달기

### Parameters

#### functionName: fileComment

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
const fc = require("file-comment");
const BASE_PATH = "/Users/anminam/Documents/program";

fc.fileComment({
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

#### functionName: removeFunction

| Name        |  Type  | script                       |
| ----------- | :----: | ---------------------------- |
| dir         | string | 검색할 Path                  |
| findStr     | string | 찾을 문자열                  |
| ext         | string | 확장자                       |
| fileFilters | string | 검색할 파일명 대소문자 구분! |

### example

```js
const fc = require("file-comment");
const BASE_PATH = "/Users/anminam/Documents/program";

fc.removeFunction({
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

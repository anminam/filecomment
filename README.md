# FileComment

[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

- 주석 달기
- 함수 삭제

## 주석달기

### Parameters

#### functionName: start
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>script</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dir</td>
      <td>string</td>
      <td>검색할 URL</td>
    </tr>
    <tr>
      <td>filter</td>
      <td>string</td>
      <td>찾을 문자열</td>
    </tr>
    <tr>
      <td>ext</td>
      <td>string</td>
      <td>확장자</td>
    </tr>
    <tr>
      <td>addStr</td>
      <td>string</td>
      <td>넣을 주석</td>
    </tr>
    <tr>
      <td>fileFilters</td>
      <td>string</td>
      <td>검색할 파일명</td>
    </tr>
    <tr>
      <td>tabNum</td>
      <td>number</td>
      <td>추가할 탭 개수</td>
    </tr>
  </tbody>
</table>

## example

```js
const fileComment = require("./module/fileCommnet");
const BASE_PATH = "/Users/anminam/Documents/program";
fileComment.start({
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

## 함수 삭제

### Parameters

#### start
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>script</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>dir</td>
      <td>string</td>
      <td>검색할 URL</td>
    </tr>
    <tr>
      <td>filter</td>
      <td>string</td>
      <td>찾을 문자열</td>
    </tr>
    <tr>
      <td>ext</td>
      <td>string</td>
      <td>확장자</td>
    </tr>
    <tr>
      <td>fileFilters</td>
      <td>string</td>
      <td>검색할 파일명</td>
    </tr>
  </tbody>
</table>

## example

```js
const removeFunction = require("./module/removeFunction");
const BASE_PATH = "/Users/anminam/Documents/program";

removeFunction.start({
  dir: BASE_PATH,
  filter: "methodName: function() {",
  ext: ".js",
  // fileFilters: ["Core.js"],
});
```

### License

fileComment is [MIT licensed](./LICENSE).

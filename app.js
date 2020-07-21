const { start } = require("./module/fileCommnet");

const BASE_PATH = "/Users/anminam";

const obj = {
  dir: BASE_PATH,
  filter: "\tsetValue: function(inKey, inValue) {",
  ext: ".js",
  addStr: `\t\t/**
\t\t* Data 값 저장.
\t\t* @method setValue
\t\t* @param  {String}    inKey   저장 키.
\t\t* @param  {any}       inValue 저장 값.
\t\t*/
`,
  fileFilters: ["Data.js"],
};

start(obj);

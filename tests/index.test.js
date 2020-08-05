const Utils = require("../module/Utils");

const config = {
  /**
   * 절대 찾지 않을 폴더 리스트
   */
  removeDirs: ["node_modules"],
  /**
   * 해당 글자로 시작하는 파일 검색 제외
   */
  removePreNames: [".", "@"],
  /**
   * 탭개수
   */
  tabNum: 1,
  /**
   * logPreText
   */
  logPreText: "테스트(Jest)",
};

describe("ex", () => {
  it("1 is 1", () => {
    expect(1).toBe(1);
  });

  it("two plus two is four", () => {
    expect(2 + 2).toBe(4);
  });
});

describe("파일찾기", () => {
  it("1 뎁스", () => {
    const obj = {
      dir: "./tests/dummy/oneDepth",
      ext: ".js",
      fileFilters: ["core.js"],
      config: config,
    };
    expect(Utils.getFilesInDirectory(obj)).toStrictEqual([
      "tests/dummy/oneDepth/core.js",
    ]);
  });
  it("2 뎁스", () => {
    const obj = {
      dir: "./tests/dummy/twoDepth",
      ext: ".js",
      fileFilters: ["core.js"],
      config: config,
    };
    expect(Utils.getFilesInDirectory(obj)).toStrictEqual([
      "tests/dummy/twoDepth/core.js",
      "tests/dummy/twoDepth/normal/core.js",
    ]);
  });
  it("3 뎁스", () => {
    const obj = {
      dir: "./tests/dummy/threeDepth",
      ext: ".js",
      fileFilters: ["core.js"],
      config: config,
    };
    expect(Utils.getFilesInDirectory(obj)).toStrictEqual([
      "tests/dummy/threeDepth/core.js",
      "tests/dummy/threeDepth/normal1/core.js",
      "tests/dummy/threeDepth/normal1/normal2/core.js",
    ]);
  });
});

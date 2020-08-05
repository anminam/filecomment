const path = require("path");
const fs = require("fs");
const fileComment = require("./fileCommnet");
const Utils = require("./Utils");

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
  logPreText: "함수지우기",
};

/**
 * 시작
 * @param {string} dir 경로
 * @param {string} filter 찾을문자
 * @param {string} ext 확장명
 * @param {string[]} fileFilters 필터 파일 배열 (확장자 포함)
 */
const start = async ({ dir, filter, ext, fileFilters }) => {
  console.log(config.logPreText, "시작");

  const files = Utils.searchFilesInDirectory(dir, filter, ext, fileFilters);
  for (file of files) {
    try {
      // 주석삭제 먼저 보내기
      await fileComment.start({
        dir,
        filter,
        ext,
        addStr: "",
        fileFullName: file,
      });

      const fileContent = await fs.readFileSync(file);
      const changedStr = changeStr(fileContent.toString(), filter, "");
      if (changedStr) {
        console.log(config.logPreText, "삭제 중", file);
        await fs.writeFileSync(file, changedStr, "utf-8");
        console.log(config.logPreText, "삭제 완료", file);
      } else {
        console.log(config.logPreText, "삭제 실패", file);
      }
    } catch (err) {
      console.error(err);
    }
  }

  console.log(config.logPreText, "종료");
};

/**
 * 변환
 * @param {string} targetStr src
 * @param {string} filterStr 찾을 문자열
 * @param {string} addStr 바꿀 문자열
 * @return {string} dst
 */
const changeStr = (targetStr, filterStr, addStr) => {
  const srcList = targetStr.split("\n");

  const findedIndex = srcList.findIndex((lineStr) =>
    lineStr.match(Utils.addEscapeStr(filterStr))
  );
  if (findedIndex === -1) {
    return null;
  }
  let nowIndex = findedIndex;

  const stackBrace = [];

  while (true) {
    const tampSrc = srcList[nowIndex++];
    if (!tampSrc) {
      tampSrc;
    }
    const isStartBrace = tampSrc.includes("{");
    const isEndBrace = tampSrc.includes("}");
    if (isStartBrace) {
      const braceLen = tampSrc.match("{");
      braceLen.forEach(() => stackBrace.push(true));
    }
    if (isEndBrace) {
      const braceLen = tampSrc.match("}");
      braceLen.forEach(() => stackBrace.pop());
    }
    console.log(stackBrace);
    if (stackBrace.length === 0) {
      break;
    }
  }

  const removedStr = srcList.splice(findedIndex, nowIndex - findedIndex);
  console.log("삭제된 문자열");
  console.table(removedStr);

  const result = srcList.join("\n");

  return result;
};

module.exports = {
  start,
};

// (() => {
//   start(
//     BASE_PATH,
//     "function runUnderwriting",
//     ".js",
//     `
// 	/**
// 	 * 가입설계 심사.
// 	 * @category 심사
// 	 * @method runUnderwriting
// 	 * @param callBackFunc 콜백 함수.
// 	 * @return {string} 리턴값
// 	 */
// 	`
//   );
// })();

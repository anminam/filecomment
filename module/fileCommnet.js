const fs = require("fs");
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
  logPreText: "주석변경",
};

const STR_TAB = "\t";
let addTabs = STR_TAB;

/**
 * 시작
 * @param {string} path 경로
 * @param {string} findStr 찾을문자
 * @param {string} ext 확장자
 * @param {string} addStr  추가할 문자
 * @param {string[]} fileFilters 필터 파일 배열 (확장자 포함)
 * @param {number} tabNum 탭 개수
 * @param {string} fileFullName 한개만 할경우 file Full Name 을 넣는다
 */
const start = async ({
  dir,
  findStr,
  ext,
  addStr,
  fileFilters,
  tabNum,
  fileFullName,
}) => {
  // 탭개수
  if (tabNum) {
    config.tabNum = tabNum;
    // 기본탭 1개있어서 1부터 시작
    for (let i = 1; i < config.tabNum; i++) {
      addTabs += STR_TAB;
    }
  }

  if (fileFullName) {
    try {
      const fileContent = await fs.readFileSync(file);
      const changedStr = changeStr(fileContent.toString(), findStr, addStr);
      console.log(config.logPreText, "작성 중", file);
      await fs.writeFileSync(file, changedStr, "utf-8");
      console.log(config.logPreText, "작성 완료", file);
    } catch (err) {
      console.error(err);
    }
  } else {
    const files = Utils.searchFilesInDirectory({
      dir,
      findStr,
      ext,
      fileFilters,
      config,
    });
    if (!files || files.length === 0) {
      console.log(config.logPreText, "파일을 찾을 수 없습니다.");
      return;
    }

    for (file of files) {
      try {
        const fileContent = await fs.readFileSync(file);
        const changedStr = changeStr(fileContent.toString(), findStr, addStr);
        console.log(config.logPreText, "작성 중", file);
        await fs.writeFileSync(file, changedStr, "utf-8");
        console.log(config.logPreText, "작성 완료", file);
      } catch (err) {
        console.error(config.logPreText, err);
      }
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
  let findIndex = targetStr.match(Utils.addEscapeStr(filterStr)).index;
  let frontStr = targetStr.substr(0, findIndex);
  let backStr = targetStr.substr(findIndex);

  // 고치려는것이 첫 라인인가?
  const isFirstLine = findIndex === frontStr.length;

  // 이상한거찾을때는 여기부터 #디버깅 시작
  const exp = new RegExp(/\/\*[\s\S]*?\*\/|\/\/.*/g);
  const arr = [...frontStr.matchAll(exp)];

  // 못찾으면 그대로 반환
  if (arr.length === 0) {
    return targetStr;
  }
  const poped = arr.pop();

  // 주석판단
  if (isUpLineComment(targetStr, filterStr)) {
    frontStr = replaceLast(frontStr, poped[0], "");
  }

  frontStr = frontStr.trimEnd() + "\n";

  // addStr 바꿀문자열이 존재할 경우 강제개행 추가
  if (addStr) {
    // 시작 인덱스와 앞글자 길이가 같다면 맨처음으로 인식하고 탭문자 & 시작문자 제거
    if (isFirstLine) {
      frontStr = "";
      addTabs = "";
    }
    addStr = changeStrPreset(addStr);
    addStr = addStr.trimEnd() + "\r\n" + addTabs;
  }

  let result = frontStr + addStr + backStr;

  return result;
};

/**
 * 찾을문자열의 바로 윗줄이 주석인지 검사
 * @param {string} targetStr src
 * @param {string} filterStr 찾을 문자열
 * @return {boolean} 주석이면 true
 */
const isUpLineComment = (targetStr, filterStr) => {
  // 윗줄 검색
  const targetStrList = targetStr.split("\n");
  let findedIndex = targetStrList.findIndex((value) => {
    return value.match(Utils.addEscapeStr(filterStr));
  });

  // 리턴값 초기화
  let isUpLineMyAnnotation = true;

  // 공백이 아닐때까지 찾는다
  let upLineStr = "";
  while (findedIndex > 0) {
    upLineStr = targetStrList[--findedIndex].trim();
    if (upLineStr) {
      break;
    }
  }

  const findUpLineMatch = upLineStr.match(/(^[\w\}]+)/gm);
  if (findUpLineMatch) {
    isUpLineMyAnnotation = false;
  }

  return isUpLineMyAnnotation;
};

/**
 * 바꿀 문자열 변경
 * @param {string} src
 * @return {string} result
 */
const changeStrPreset = (src) => {
  // 나누기
  let srcList = src.split(/\n/).filter((item) => {
    return item.length !== 0;
  });

  /**
   * trim
   * 첫주석글자(/**) 로 시작하면 addTabs 만큼 추가
   */
  srcList = srcList.map((item) => {
    let tempStr = item.trim();
    if (item.includes("/**")) {
      tempStr = addTabs + tempStr;
    } else {
      tempStr = addTabs + " " + tempStr;
    }
    return tempStr;
  });

  return srcList.join("\n");
};

/**
 * string replace last 모드
 * @param {string} src 문자열
 * @param {string} findStr 찾을 문자열
 * @param {string} replaceStr 바꿀 문자열
 */
const replaceLast = (src, findStr, replaceStr) => {
  var lastIndex = src.lastIndexOf(findStr);

  if (lastIndex === -1) {
    return src;
  }

  var beginString = src.substring(0, lastIndex);
  var endString = src.substring(lastIndex + findStr.length);

  return beginString + replaceStr + endString;
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

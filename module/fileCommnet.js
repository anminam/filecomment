const path = require("path");
const fs = require("fs");

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
};

const STR_TAB = "\t";
let addTabs = STR_TAB;

/**
 * 파일 찾아서 검색
 * @param {*} dir path
 * @param {*} filter 필터
 * @param {*} ext 확장자
 * @return {string[]} 찾은 파일리스트
 */
const searchFilesInDirectory = (dir, filter, ext, fileFilters) => {
  const findFiles = [];

  if (!fs.existsSync(dir)) {
    console.log("존재하지 않음", dir);
    return [];
  }

  const files = getFilesInDirectory(dir, ext, fileFilters);
  files.forEach((file, i) => {
    if (file === undefined) {
      return true;
    }
    const fileContent = fs.readFileSync(file);

    if (isFindedFile(fileContent, filter)) {
      console.log("찾기", "success", ` ${i} ${file}`);
      findFiles.push(file);
    }
  });

  return findFiles;
};

/**
 * 실제 문자열 찾기
 * @param {string} src 찾을 문자열
 * @param {string} filter 필터
 * @return {boolean}
 */
const isFindedFile = (src, filter) => {
  let newFilter = addEscapeStr(filter);
  const regex = new RegExp(`\t?${newFilter}`);
  if (regex.test(src)) {
    const regex2 = new RegExp("//[\\s]*" + newFilter);
    // 함수앞에 주석이있어 조심해야함
    if (regex2.test(src)) {
      return false;
    }

    return true;
  }

  return false;
};

/**
 * 디렉토리 안에 파일찾기
 * @param {string} dir dir
 * @param {string} ext 확장자
 * @return {string[]} files 파일명 리스트
 */
const getFilesInDirectory = (dir, ext, fileFilters) => {
  let files = [];

  if (!fs.existsSync(dir)) {
    console.log(`Specified directory: $ {dir}does not exist `);
    return files;
  }

  if (config.removeDirs) {
    let isPass = false;
    config.removeDirs.forEach((tempDir) => {
      if (dir.includes(tempDir)) {
        isPass = true;
      }
    });
    if (isPass) {
      return files;
    }
  }

  fs.readdirSync(dir).forEach((file, i) => {
    // . @ 로 시작하는 파일 제거
    if (config.removePreNames.includes(file.substr(0, 1))) {
      return true;
    }

    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    // 디랙토리면
    if (stat.isDirectory()) {
      // 파일 찾을때까지 재귀
      const nestedFiles = getFilesInDirectory(filePath, ext, fileFilters);
      files = files.concat(nestedFiles);

      // 파일이면
    } else {
      // 파일 필터가 있으면 필터 있는것만 사용
      if (fileFilters) {
        if (!fileFilters.includes(file)) {
          return true;
        }
      }

      // 확장자가 맞으면 값 삽입
      if (path.extname(file) === ext) {
        files.push(filePath);
      }
    }
  });

  return files;
};

/**
 * 특수문자 앞에 '\' 추가
 * @param {string} str 바꿀 문자열
 */
const addEscapeStr = (str) => {
  let tempArr = str.split("");
  tempArr = tempArr.map((value) => {
    if (["(", ")", "{", "}", "[", "]"].includes(value)) {
      value = "\\" + value;
    } else if (" ".includes(value)) {
      value = "\\s?";
    }
    return value;
  });

  return tempArr.join("");
};

/**
 * 변환
 * @param {string} targetStr src
 * @param {string} filterStr 찾을 문자열
 * @param {string} addStr 바꿀 문자열
 * @return {string} dst
 */
const changeStr = (targetStr, filterStr, addStr) => {
  let findIndex = targetStr.toString().indexOf(filterStr);
  let frontStr = targetStr.substr(0, findIndex);
  let backStr = targetStr.substr(findIndex);

  const exp = new RegExp(/\/\*[\s\S]*?\*\/|\/\/.*/g);
  const arr = [...frontStr.matchAll(exp)];
  // 못찾으면 그대로 반환
  if (arr.length === 0) {
    return targetStr;
  }
  const poped = arr.pop();

  // 자신 위에있는 것이 주석인지 다른 변수나, 함수인지 판단해서 지울지 말지 결정
  const fontIndex = frontStr.length;
  const popedIndex = poped.index + poped[0].length;
  const diff = Math.abs(popedIndex - fontIndex);
  // 차이가 5이하일 경우 자신의 주석이다 라고 판단하고 지우기
  if (diff <= 5) {
    frontStr = replaceLast(frontStr, poped[0], "");
  }

  frontStr = frontStr.trimEnd() + "\n";

  addStr = changeStrPreset(addStr);
  addStr = addStr.trimEnd() + "\r\n" + addTabs;

  let result = frontStr + addStr + backStr;

  return result;
};

/**
 * 바꿀 문자열 변경
 * @param {*} src
 * @return result
 */
const changeStrPreset = (src) => {
  // 나누기
  let srcList = src.split(/\n/).filter((item) => {
    return item.length !== 0;
  });

  /**
   * trim
   * 첫주석글자(/**) 로 시작하면 \t\t 추가
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

/**
 * 시작
 * @param {string} dir 경로
 * @param {string} filter 찾을문자
 * @param {string} ext 확장명
 * @param {string} addStr  추가할 문자
 * @param {string[]} fileFilters 필터 파일 배열 (확장자 포함)
 * @param {number} tabNum 탭 개수
 */
const start = async ({ dir, filter, ext, addStr, fileFilters, tabNum }) => {
  // 탭개수
  if (tabNum) {
    config.tabNum = tabNum;
    // 기본탭 1개있어서 1부터 시작
    for (let i = 1; i < config.tabNum; i++) {
      addTabs += STR_TAB;
    }
  }

  const files = searchFilesInDirectory(dir, filter, ext, fileFilters);
  for (file of files) {
    try {
      const fileContent = await fs.readFileSync(file);
      const changedStr = changeStr(fileContent.toString(), filter, addStr);
      console.log(file, "쓰는중");
      await fs.writeFileSync(file, changedStr, "utf-8");
      console.log(file, "쓰기완료");
    } catch (err) {
      console.error(err);
    }
  }

  console.log("종료");
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

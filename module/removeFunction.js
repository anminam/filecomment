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
    console.log(config.logPreText, "존재하지 않음", dir);
    return [];
  }

  const files = getFilesInDirectory(dir, ext, fileFilters);
  files.forEach((file, i) => {
    if (file === undefined) {
      return true;
    }
    const fileContent = fs.readFileSync(file);

    if (isFindedFile(fileContent, filter)) {
      console.log(config.logPreText, "파일검색", "success", ` ${i} ${file}`);
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
  let newFilter = Utils.addEscapeStr(filter);
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

/**
 * 시작
 * @param {string} dir 경로
 * @param {string} filter 찾을문자
 * @param {string} ext 확장명
 * @param {string[]} fileFilters 필터 파일 배열 (확장자 포함)
 */
const start = async ({ dir, filter, ext, fileFilters }) => {
  console.log(config.logPreText, "시작");

  const files = searchFilesInDirectory(dir, filter, ext, fileFilters);
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

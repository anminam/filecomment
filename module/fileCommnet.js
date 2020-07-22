const path = require("path");
const fs = require("fs");

const removeDirs = ["node_modules"];

/**
 * 파일 찾아서 검색
 * @param {*} dir path
 * @param {*} filter 필터
 * @param {*} ext 확장자
 * @return {string[]} 찾은 파일리스트
 */
const searchFilesInDirectory = (dir, filter, ext, fileFilters) => {
  if (!fs.existsSync(dir)) {
    console.log(`Specified directory: ${dir} does not exist`);
    return;
  }

  const findFiles = [];

  const files = getFilesInDirectory(dir, ext, fileFilters);
  files.forEach((file, i) => {
    if (file === undefined) {
      return true;
    }
    const fileContent = fs.readFileSync(file);

    let newFilter = addEscapeStr(filter);
    const regex = new RegExp(`\t?${newFilter}`);
    if (regex.test(fileContent)) {
      findFiles.push(file);
      console.log("찾기", "success", ` ${i} ${file}`);
    } else {
      // console.log("찾기", "fail", ` ${i} ${file}`);
    }
  });

  return findFiles;
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
 * 디렉토리 안에 파일찾기
 * @param {string} dir dir
 * @param {string} ext 확장자
 * @return {string[]} files 파일명 리스트
 */
const getFilesInDirectory = (dir, ext, fileFilters) => {
  if (!fs.existsSync(dir)) {
    console.log(`Specified directory: $ {dir}does not exist `);
    return;
  }

  if (removeDirs) {
    let isPass = false;
    removeDirs.forEach((iDir) => {
      if (dir.includes(iDir)) {
        isPass = true;
      }
    });
    if (isPass) {
      return;
    }
  }

  let files = [];
  fs.readdirSync(dir).forEach((file, i) => {
    // . @ 로 시작하는 파일 제거
    if ([".", "@"].includes(file.substr(0, 1))) {
      return true;
    }

    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    // 디랙토리면
    if (stat.isDirectory()) {
      const nestedFiles = getFilesInDirectory(filePath, ext, fileFilters);
      files = files.concat(nestedFiles);
      if (i === 36) {
        i;
      }

      // 파일이면
    } else {
      // 파일 필터가 있으면 필터 있는것만 사용
      if (fileFilters) {
        if (!fileFilters.includes(file)) {
          return true;
        }
      }
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
 * @param {string} filterStr
 * @param {string} addStr
 * @return {string} dst
 */
const changeStr = (targetStr, filterStr, addStr) => {
  let findIndex = targetStr.toString().indexOf(filterStr);
  let front = targetStr.substr(0, findIndex);
  let strBack = targetStr.substr(findIndex);

  const exp = new RegExp(/\/\*[\s\S]*?\*\/|\/\/.*/g);
  const arr = [...front.matchAll(exp)];
  if (arr.length === 0) {
    return targetStr;
  }
  const poped = arr.pop();

  // TODO: 함수 위에있는 것이 주석인지 다른 변수나, 함수인지 판단해서 지울지 말지 정하는것 추가해야함
  const fontIndex = front.length;
  const popedIndex = poped.index + poped[0].length;
  const diff = Math.abs(popedIndex - fontIndex);
  if (diff < 5) {
    front = front.replace(poped[0], "");
  }

  front = front.trimEnd() + "\n";
  addStr = addStr.trimEnd() + "\r\n\t";

  let result = front + addStr + strBack;

  return result;
};

/**
 * 시작
 * @param {string} dir 경로
 * @param {string} filter 찾을문자
 * @param {string} ext 확장명
 * @param {string} addStr  추가할 문자
 * @param {string[]} fileFilters 필터 파일 배열 (확장자 포함)
 */
const start = async ({ dir, filter, ext, addStr, fileFilters }) => {
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
  // await files.forEach(async (file) => {
  //   try {
  //     const fileContent = await fs.readFileSync(file);
  //     const changedStr = changeStr(fileContent.toString(), filter, addStr);
  //     console.log(file, "쓰는중");
  //     await fs.writeFileSync(file, changedStr, "utf-8");
  //     console.log(file, "쓰기완료");
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   // fs.writeFile(file, changedStr, "utf-8", (err) => {
  //   //   if (err) {
  //   //     console.log(`${err}, 파일을 쓸 수없습니다.`);
  //   //   }
  //   //   console.log("파일쓰기 성공");
  //   // });
  // });

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

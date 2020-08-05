const path = require("path");

const Utils = {
  /**
   * 특수문자 앞에 '\' 추가
   * @param {string} str 바꿀 문자열
   */
  addEscapeStr: (str) => {
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
  },

  /**
   * 파일 찾아서 검색
   * @param {*} dir path
   * @param {*} filter 필터
   * @param {*} ext 확장자
   * @return {string[]} 찾은 파일리스트
   */
  searchFilesInDirectory: (dir, filter, ext, fileFilters) => {
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

      if (this.isFindedFile(fileContent, filter)) {
        console.log(config.logPreText, "파일검색", "success", ` ${i} ${file}`);
        findFiles.push(file);
      }
    });

    return findFiles;
  },

  /**
   * 실제 문자열 찾기
   * @param {string} src 찾을 문자열
   * @param {string} filter 필터
   * @return {boolean}
   */
  isFindedFile: (src, filter) => {
    let newFilter = this.addEscapeStr(filter);
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
  },

  /**
   * 디렉토리 안에 파일찾기
   * @param {string} dir dir
   * @param {string} ext 확장자
   * @return {string[]} files 파일명 리스트
   */
  getFilesInDirectory: (dir, ext, fileFilters) => {
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
        const nestedFiles = this.getFilesInDirectory(
          filePath,
          ext,
          fileFilters
        );
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
  },
};

module.exports = Utils;

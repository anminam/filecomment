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
};

module.exports = Utils;

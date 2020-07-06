const path = require('path');
const fs = require('fs');

const BASE_PATH = '/Users/anminam/';

/**
 * 파일 찾아서 검색 
 * @param {*} dir path
 * @param {*} filter 필터
 * @param {*} ext 확장자
 * @return {string[]} 찾은 파일리스트
 */
const searchFilesInDirectory = (dir, filter, ext) => {
	if (!fs.existsSync(dir)) {
		console.log(`Specified directory: ${dir} does not exist`);
		return;
	}

	const findFiles = [];

	const files = getFilesInDirectory(dir, ext);
	files.forEach(file => {
		const fileContent = fs.readFileSync(file);

		// We want full words, so we use full word boundary in regex.
		const regex = new RegExp('\\b' + filter + '\\b');
		if (regex.test(fileContent)) {
			findFiles.push(file);
			console.log(`success ${file}`);
		} else {
			console.log(`fail ${file}`)
		}
	});

	return findFiles;
}

/**
 * 디렉토리 안에 파일찾기
 * @param {string} dir 
 * @param {*} ext 
 * @return {string[]} files
 */
const getFilesInDirectory = (dir, ext) => {
	if (!fs.existsSync(dir)) {
		console.log(`Specified directory: $ {dir}does not exist `);
		return;
	}

	let files = [];
	fs.readdirSync(dir).forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.lstatSync(filePath);

		// If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
		if (stat.isDirectory()) {
			const nestedFiles = getFilesInDirectory(filePath, ext);
			files = files.concat(nestedFiles);
		} else {
			if (path.extname(file) === ext) {
				files.push(filePath);
			}
		}
	});

	return files;
}

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
	const poped = arr.pop();

	// TODO: 함수 위에있는 것이 주석인지 다른 변수나, 함수인지 판단해서 지울지 말지 정하는것 추가해야함
	const fontIndex = front.length;
	const popedIndex = poped.index + poped[0].length;
	const diff = Math.abs(popedIndex - fontIndex);
	if (diff < 5) {
		front = front.replace(poped[0], '');
	}

	front = front.trimEnd() + '\n';
	addStr = addStr.trimEnd() + '\r\n\t';

	let result = front + addStr + strBack;

	return result;
}

/**
 * 시작
 * @param {*} dir 
 * @param {*} filter 
 * @param {*} ext 
 * @param {*} addText 
 */
const start = (dir, filter, ext, addText) => {

	const files = searchFilesInDirectory(dir, filter, ext)
	files.forEach(file => {
		const fileContent = fs.readFileSync(file);
		const changedStr = changeStr(fileContent.toString(), filter, addText);
		fs.writeFile(file, changedStr, 'utf-8', (err) => {
			console.log(`${err}, 파일을 쓸 수없습니다.`)
		})
	});
}

(() => {
	start(
		BASE_PATH,
		'function funcRun',
		'.js',
		`
	/**
	 * 여기다 주석.
	 * @method 메소드 혹은 함수 이름
	 * @category 카테고리 이름
	 * @return {string} 리턴값
	 */
	`)
})();
const SAVED_DIR = 'yylDownload'
const SAVE_PATH = `_doc/${SAVED_DIR}`

//文件的操作  只用于app端使用
/**
 * @param {string} filePath
 */
export function saveFile(tempFilePath, successCallback, errorCallback) {

	plus.io.resolveLocalFileSystemURL(tempFilePath, entry => { // 读取临时文件 FileEntry
		let fileName = entry.name.split(".");
		fileName = `${fileName[0]}${Date.now()}.${fileName[1]}`
		console.log(fileName);
		getSavedFileDir(dir => {
			entry.copyTo(dir, fileName, () => { // 复制临时文件 FileEntry，为了避免把相册里的文件删除，使用 copy，微信中是要删除临时文件的
				const savedFilePath = SAVE_PATH + '/'

				successCallback({
					errMsg: 'saveFile:ok',
					savedFilePath
				})

			}, errorCallback)
		}, errorCallback)
	}, errorCallback)
}

function getSavedFileDir(success, fail) {
	fail = fail || function() {}
	plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, fs => { // 请求_doc fs
		fs.root.getDirectory(SAVED_DIR, { // 获取文件保存目录对象
			create: true
		}, success, fail)
	}, fail)
}

export function download(item) {

	const url = item.fileUrl
	const fileName = item.fileName + "." + item.suffix
	return new Promise(function(resolve, reject) {
		if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
			reject(new Error('地址错误'))
			return
		}
		plus.downloader.createDownload(url, {
			filename: '_doc/uniapp_temp/download/' + fileName,
			retry: 0,
			retryInterval: 0
		}, function(d, status) {
			console.log(status);
			if (status === 200) {
				console.log(d.filename);
				resolve(d.filename)
			} else {
				reject(new Error('network fail'))
			}
		}).start()
	})
}

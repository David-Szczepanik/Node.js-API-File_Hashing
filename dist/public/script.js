"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
(_a = document.getElementById('hashButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    var _a;
    const fileInput = document.getElementById('fileInput');
    const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
    if (file) {
        hashFile(file);
    }
    else {
        alert('Please choose a file.');
    }
});
function hashFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const progressBar = document.getElementById('progress-bar');
        const hashResultContainer = document.getElementById('hashResult');
        const fileSize = file.size;
        const CHUNK_SIZE = 1024 * 1024; // 1 MB chunks
        let offset = 0;
        function processChunk() {
            return __awaiter(this, void 0, void 0, function* () {
                const chunk = file === null || file === void 0 ? void 0 : file.slice(offset, offset + CHUNK_SIZE);
                offset += CHUNK_SIZE;
                const reader = new FileReader();
                reader.onload = function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const chunkData = new Uint8Array(event.target.result);
                        const response = yield sendChunk(chunkData);
                        const progress = offset / fileSize;
                        progressBar.style.width = `${progress * 100}%`;
                        if (offset < fileSize) {
                            yield processChunk();
                        }
                        else {
                            progressBar.style.width = '100%';
                            hashResultContainer.innerHTML = `File Name: ${file.name}<br>File Size: ${fileSize} bytes<br>File Hash: ${response.hash}`;
                            saveBackup(file, response.hash);
                        }
                    });
                };
                reader.readAsArrayBuffer(chunk !== null && chunk !== void 0 ? chunk : new Blob());
            });
        }
        function sendChunk(chunkData) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield fetch('/hash', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                    },
                    body: chunkData,
                });
                return response.json();
            });
        }
        yield processChunk();
    });
}
function saveBackup(file, hash) {
    fetch('/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileHash: hash,
        }),
    })
        .then((response) => response.json())
        .then((backupInfo) => {
        console.log('Backup information saved to the server:', backupInfo);
    })
        .catch((error) => {
        console.error('Error saving backup information:', error);
    });
}

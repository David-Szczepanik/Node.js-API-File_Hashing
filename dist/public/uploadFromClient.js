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
function handleFile() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileInput = document.getElementById('fileInput');
        const file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            try {
                const fileInfo = yield sendFileToBackend(file);
                console.log('File Size and Hash:', fileInfo);
            }
            catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            console.error('No file selected');
        }
    });
}
function sendFileToBackend(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = new FormData();
        formData.append(file.name, file);
        try {
            const response = yield fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            return response.json();
        }
        catch (error) {
            throw new Error('Error sending file to server: ' + error);
        }
    });
}

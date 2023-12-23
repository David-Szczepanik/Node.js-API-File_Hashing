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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFile = void 0;
const busboy_1 = __importDefault(require("busboy"));
const crypto_1 = __importDefault(require("crypto"));
const CustomError_1 = __importDefault(require("./Utils/CustomError"));
const hashFile = (req, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const busboy = (0, busboy_1.default)({ headers: req.headers });
        const files = [];
        return new Promise((resolve) => {
            busboy.on('file', (name, file) => {
                const fileData = {
                    fileName: name || '',
                    fileSize: 0,
                    fileHash: '',
                };
                const hash = crypto_1.default.createHash('sha1');
                file.on('data', (data) => {
                    fileData.fileSize += data.length;
                    hash.update(data);
                })
                    .on('close', () => {
                    fileData.fileHash = hash.digest('hex');
                    files.push(fileData);
                });
            });
            busboy.on('close', () => {
                console.log('Busboy has finished processing files.');
                resolve(files);
            });
            busboy.on('error', () => {
                req.unpipe(busboy);
                const err = new CustomError_1.default((`Error hashing file: ${__filename}`), 500);
                next(err);
            });
            req.pipe(busboy);
        });
    }
    catch (error) {
        next(error);
        throw new Error(`Error hashing file: ${__filename}` + error);
    }
});
exports.hashFile = hashFile;

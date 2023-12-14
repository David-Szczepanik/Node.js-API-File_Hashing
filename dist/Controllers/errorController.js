"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorHTML = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handleErrorHTML = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'generic error';
    const filePath = path_1.default.resolve(__dirname, '../../dist/public', 'error.html');
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading HTML file: ${err.message}`);
            res.status(error.statusCode).send('Internal Server Error');
            return;
        }
        const replacedHTML = data
            .replace('%statusCode%', error.statusCode)
            .replace('%errorMessage%', error.message)
            .replace('%errorStack%', error.stack)
            .replace('%error%', error);
        res.setHeader('Content-Type', 'text/html');
        res.status(error.statusCode).send(replacedHTML);
    });
};
exports.handleErrorHTML = handleErrorHTML;
// => JSON
// export const handleErrorJSON = (error: any, req: Request, res: Response,next: NextFunction) =>{
//     error.statusCode = error.statusCode || 500;
//     error.status = error.status || 'error'; //400 client | 500 server
//     console.error(error.stack);
//     res.status(error.statusCode).json({
//         status: error.statusCode,
//         message: error.message,
//         stackTrace: error.stack,
//         error: error
//     });
// }

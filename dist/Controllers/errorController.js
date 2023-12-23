"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrorJSON = void 0;
// import fs from 'fs';
// import path from "path";
// => HTML
// export const handleErrorHTML =(error: any, req: Request, res: Response,next: NextFunction)=> {
//     error.statusCode = error.statusCode || 500;
//     error.status = error.status || 'generic error';
//
//     const filePath = path.resolve(__dirname,'../../dist/public', 'error.html');
//
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error(`Error reading HTML file: ${err.message}`);
//             res.status(error.statusCode).send('Internal Server Error');
//             return;
//         }
//
//         const replacedHTML = data
//             .replace('%statusCode%', error.statusCode)
//             .replace('%errorMessage%', error.message)
//             .replace('%errorStack%', error.stack)
//             .replace('%error%', error);
//
//         res.setHeader('Content-Type', 'text/html');
//
//         res.status(error.statusCode).send(replacedHTML);
//     });
// }
// => JSON
const handleErrorJSON = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'; //400 client | 500 server
    console.error(error.stack);
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
};
exports.handleErrorJSON = handleErrorJSON;

import Busboy from 'busboy';
import crypto from 'crypto';
import { IncomingMessage } from 'http';
import CustomError from "./Utils/CustomError";
import {NextFunction} from "express";
import {fileInfo} from "./public/uploadFromClient";

const hashFile = async (req: IncomingMessage, next: NextFunction): Promise<fileInfo[]> => {
    try {
        const busboy = Busboy({ headers: req.headers });
        const files: fileInfo[] = [];

        return new Promise((resolve) => {
            busboy.on('file', (name: string, file: any) => {
                const fileData: fileInfo = {
                    fileName: name || '',
                    fileSize: 0,
                    fileHash: '',
                };
                const hash = crypto.createHash('sha1');

                file.on('data', (data: any) => {
                    fileData.fileSize += data.length;
                    hash.update(data);
                })
                    .on('close', () => {
                    fileData.fileHash = hash.digest('hex');
                    files.push(fileData);
                });
            });

            busboy.on('close', () => {
                console.log('Busboy has finished processing files.')
                resolve(files);
            });

            busboy.on('error', () => {
                req.unpipe(busboy);
                const err = new CustomError((`Error hashing file: ${__filename}`), 500);
                next(err);
            });

            req.pipe(busboy);
        });

    } catch (error) {
        next(error);
        throw new Error(`Error hashing file: ${__filename}` + error);
    }
};

export { hashFile };
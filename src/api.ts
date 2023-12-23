import {NextFunction, Request, Response} from "express";
import path from "path";
import {promises as fsPromises} from "fs";

import {asyncErrorHandler} from './Utils/asyncErrorHandler';
import CustomError from "./Utils/CustomError";
import db from "./models/models";
import {hashFile} from "./upload";

export const respondIndex = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) => {
    const indexPath = path.resolve(__dirname, 'public', 'index.html');
    console.log(indexPath);
    debugger;

    try { //if file exists send it
        await fsPromises.access(indexPath, fsPromises.constants.F_OK);
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.sendFile(indexPath);

    } catch (err) { // otherwise create an error and pass it to middleware
        const error = new CustomError('Index.html not found', 404);
        next(error);
    }
})

export const respondDatabaseJSON = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction)=> {
    try {
        res.setHeader('Content-Type', 'application/json');

        res.json(await db.File.findAll({
            attributes: ['fileName', 'fileSize', 'fileHash'],
            order: [['createdAt', 'DESC']],
        }));
    } catch (err) {
        const error = new CustomError('Database unreachable', 550);
        next(error);
    }
})

export const respondUpload = asyncErrorHandler(async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const files = await hashFile(req, next);
        const newFiles = [];

        for (const { fileSize, fileName, fileHash } of files) {
            // => DB
            const newFile = await db.File.create({
                fileName,
                fileSize,
                fileHash,
            });

            const backupJsonPath = 'backup.json';
            const backupTxtPath = 'backup.txt';

            // => JSON
            let existingContent;
            try {
                const existingJsonData = await fsPromises.readFile(backupJsonPath, 'utf-8');
                existingContent = JSON.parse(existingJsonData);
            } catch (readError) {
                // Create JSON if it doesn't exist
                existingContent = [];
            }
            existingContent.push(newFile);

            await fsPromises.writeFile(backupJsonPath, JSON.stringify(existingContent, null, 2));

            // => TXT
            const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const currentTime = new Date().toLocaleTimeString('cs-CZ'); // HH:MM:SS
            const textContent = `File Name: ${fileName}\nFile Size: ${fileSize} bytes\nSHA-1 Hash: ${fileHash}\nDate: ${currentDate}-${currentTime}\n\n`;
            await fsPromises.appendFile(backupTxtPath, textContent);

            console.log('File information saved to backup.json and backup.txt');
            newFiles.push(newFile);
        }

        res.status(201).json({
            status: 'Success',
            message: 'Files uploaded successfully',
            files: newFiles,
        });
    } catch (err) {
        console.error('Error uploading files:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
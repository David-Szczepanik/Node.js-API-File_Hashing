import {NextFunction, Request, Response} from "express";
import path from "path";
import {promises as fsPromises} from "fs";

import {asyncErrorHandler} from './Utils/asyncErrorHandler';
import CustomError from "./Utils/CustomError";
import db from "./models/models";
import {hashFile} from "./upload";

/**
 * Responds with the index.html file.
 * If the file does not exist, passes a 404 error to the middleware.
 * @param {Request} req - The requested URL.
 * @param {Response} res - The response with HTML file.
 * @param {NextFunction} next - The next middleware function.
 * @see {@link Utils/asyncErrorHandler.asyncErrorHandler | asyncErrorHandler} Try-catch block for functions and passes any error to next middleware
 */

export const respondIndex = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  const indexPath = path.resolve(__dirname, 'public', 'index.html');
  console.log(indexPath);
  debugger;

  try {
    // Check if the file exists
    await fsPromises.access(indexPath, fsPromises.constants.F_OK);
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Send the file
    res.sendFile(indexPath);
  } catch (err) {
    // File does not exist, create an error and pass it to middleware
    const error = new CustomError('Index.html not found', 404);
    next(error);
  }
});

/**
 * @category Express Middleware
 * @group Express
 * @categoryDescription test
 * Responds with a JSON array of file metadata from the database.
 * If the database is unreachable, passes a 550 error to the middleware.
 */
/**
 * @category Express
 */
export const respondDatabaseJSON = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    // Fetch and return file metadata from the database
    const files = await db.File.findAll({
      attributes: ['fileName', 'fileSize', 'fileHash'],
      order: [['createdAt', 'DESC']],
    });
    res.json(files);
  } catch (err) {
    // Database is unreachable, create an error and pass it to middleware
    const error = new CustomError('Database unreachable', 550);
    next(error);
  }
});

/**
 * @category Express Middleware
 * Handles file upload, saves metadata to the database, and writes backups to JSON and TXT files.
 * If an error occurs during the process, responds with a 500 Internal Server Error.
 */
export const respondUpload = asyncErrorHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Process file upload and hash the files
    const files = await hashFile(req, next);
    const newFiles = [];

    for (const {fileSize, fileName, fileHash} of files) {
      // Save file metadata to the database
      const newFile = await db.File.create({fileName, fileSize, fileHash});

      const backupJsonPath = 'backup.json';
      const backupTxtPath = 'backup.txt';

      // Read existing JSON backup or initialize a new array
      let existingContent;
      try {
        const existingJsonData = await fsPromises.readFile(backupJsonPath, 'utf-8');
        existingContent = JSON.parse(existingJsonData);
      } catch (readError) {
        existingContent = [];
      }
      existingContent.push(newFile);

      // Write updated JSON backup
      await fsPromises.writeFile(backupJsonPath, JSON.stringify(existingContent, null, 2));

      // Write backup information to TXT file
      const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const currentTime = new Date().toLocaleTimeString('cs-CZ'); // HH:MM:SS
      const textContent = `File Name: ${fileName}\nFile Size: ${fileSize} bytes\nSHA-1 Hash: ${fileHash}\nDate: ${currentDate} ${currentTime}\n\n`;
      await fsPromises.appendFile(backupTxtPath, textContent);

      console.log('File information saved to backup.json and backup.txt');
      newFiles.push(newFile);
    }

    // Respond with success status and details of uploaded files
    res.status(201).json({
      status: 'Success',
      message: 'Files uploaded successfully',
      files: newFiles,
    });
  } catch (err) {
    console.error('Error uploading files:', err);
    // Respond with an internal server error status
    res.status(500).json({error: 'Internal Server Error'});
  }
});

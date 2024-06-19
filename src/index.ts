import express, {Express, NextFunction, Request, Response} from 'express';
import db from './models/models';
import path from "path";
import cors from 'cors';
import morgan from 'morgan';
import CustomError from "./Utils/CustomError";
import {handleErrorHTML, handleErrorJSON} from './Controllers/errorController';
import {respondIndex, respondDatabaseJSON, respondUpload} from './api';

/**
 * @class App
 * @description This class encapsulates an Express application.
 * @example
 *
 * const app = express();
 *
 * const port = process.env.PORT || 8080;
 * app.use(morgan('dev'));
 * app.use(cors());
 * app.use(express.json());
 * app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));
 *
 * app.get('/', respondIndex);
 * app.get('/databaseJSON', respondDatabaseJSON);
 * app.post('/upload', respondUpload);
 *
 * app.all('*', (req: Request, res: Response, next: NextFunction) => {
 *   const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
 *   next(err); // passing an argument to the next fn will trigger the global error handling middleware
 *   // It will skip all other middleware fns
 * });
 *
 * => JSON for backend
 * => HTML for frontend
 * app.use(handleErrorHTML);
 * // app.use(handleErrorJSON);
 *
 *
 *
 * // Start the server and sync the database.
 * // {force:true} for DROP & RECREATE DB
 * db.sequelize.sync().then(() => {
 *   app.listen(port, () => {
 *     console.log(`Server running at http://localhost:${port}`);
 *   });
 * });
 */


class App {
  public app: Express;
  public port: number;

  /**
   * @constructor
   * @param {number} [port] - The port number on which the Express application will listen.
   */
  constructor(port?: number) {
    this.app = express();
    this.port = port || 8080;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * @method initializeMiddlewares
   * @description Initializes the middleware for the Express application.
   * @private
   */
  private initializeMiddlewares() {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '..', 'dist', 'public')));
  }

  /**
   * @method initializeRoutes
   * @description Initializes the routes for the Express application.
   * @private
   */
  private initializeRoutes() {
    this.app.get('/', respondIndex);
    this.app.get('/databaseJSON', respondDatabaseJSON);
    this.app.post('/upload', respondUpload);

    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      const err = new CustomError(`Can't find ${req.originalUrl} on this server!`, 404);
      next(err);
    });
  }

  /**
   * @method initializeErrorHandling
   * @description Initializes the error handling for the Express application.
   * @private
   */
  private initializeErrorHandling() {
    this.app.use(handleErrorHTML);
    // this.app.use(handleErrorJSON);
  }

  /**
   * @method listen
   * @description Starts the Express application.
   * @public
   */
  public listen() {
    db.sequelize.sync().then(() => {
      this.app.listen(this.port, () => {
        console.log(`Server running at http://localhost:${this.port}`);
      });
    });
  }
}

export default App;

/**
 * @description Creates an instance of the App class and starts the Express application.
 */
const app = new App(8080);
app.listen();

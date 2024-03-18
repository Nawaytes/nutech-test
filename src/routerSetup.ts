import express from 'express';
import MainRouter from "./routes";

export class Routes {
  constructor(expressInstance: express.Express) {
    this.routesSetup(expressInstance);
  }

  routesSetup(expressInstance: express.Express) {
    expressInstance.use("/", new MainRouter().router);
  }
}
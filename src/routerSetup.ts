import express from 'express';
import MainRouter from './routes';
import UserRouter from './routes/user/user.route';


export class Routes {
    constructor(expressInstance: express.Express) {
        this.routesSetup(expressInstance)
    }

    routesSetup(expressInstance: express.Express) {
        expressInstance.use('/', new MainRouter().router)
        expressInstance.use('/users', new UserRouter().router)
    }
}
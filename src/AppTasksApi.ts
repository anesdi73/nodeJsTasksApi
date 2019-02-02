import express, { Express } from "express";
import bodyParser  from 'body-parser';
class AppTasksApi{
    public express:Express;
    constructor() {
        this.express = express();
		this.express.use(bodyParser.json());
		this.mountRoutes();
    }
    private mountRoutes() {
        this.express.get("/", (req, res) => {
			res.send("Welcome to the Tasks Api");
		});
    }
}
export = AppTasksApi;
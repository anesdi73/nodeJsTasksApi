import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { TasksStorage, Task } from "./TasksStorage";
import HttpStatusCodes from 'http-status-codes'
class AppTasksApi {
	public express: Express;
	private taksStorage: TasksStorage;
	constructor() {
		
	}
	initialize() {
		this.express = express();
		this.express.use(bodyParser.json());
		this.mountRoutes();
		this.taksStorage = new TasksStorage();
		this.taksStorage.initialize();
	}
	private mountRoutes() {
		this.express.get("/", (req, res) => {
			res.send("Welcome to the Tasks Api");
		});
		this.express.get(
			"/tasks",
			wrapAsync(async (req: Request, res: Response) => {
				const tasks = await this.taksStorage.getTasks();
				res.json(tasks);
			})
		);
		this.express.get(
			"/tasks/:id",
			wrapAsync(async (req: Request, res: Response) => {
				const id = req.params.id;
				const task = await this.taksStorage.getTask(id);
				if (task) {
					res.json(task);
				}
				
			})
		);
		this.express.post(
			"/tasks",
			wrapAsync(async (req: Request, res: Response) => {
				const taskToAdd:Task = req.body;
				const addedTask:Task =await this.taksStorage.addTask(taskToAdd);
				res.status(HttpStatusCodes.CREATED). json(addedTask);
			})
		);
		this.express.put(
			"/tasks/:id",
			wrapAsync(async (req: Request, res: Response) => {
				const id = req.params.id;
				const taskToAdd:Task = req.body;
				const updatedTask:Task =await this.taksStorage.updateTask(id,taskToAdd);
				if (updatedTask) {
					res.status(HttpStatusCodes.OK).json(updatedTask);
				} else {
					res.status(HttpStatusCodes.NOT_FOUND);
				}
				
			})
		);
		this.express.delete(
			"/tasks/:id",
			wrapAsync(async (req: Request, res: Response) => {
				const id = req.params.id;
				const deletedTask:Task =await this.taksStorage.deleteTask(id);
				if (deletedTask) {
					res.status(HttpStatusCodes.OK).json(deletedTask);
				} else {
					res.status(HttpStatusCodes.NOT_FOUND);
				}
				
			})
        );
        //The route is unknown
		this.express.use((req, res, next) => {
			res.status(HttpStatusCodes.NOT_FOUND).send("Sorry cant find that!");
        });
        //Error handling
		this.express.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(error.toString());
		});
	}

}
/**
 * easy exceptions handling when async await is used
 *
 * @param {Function} fn
 * @returns
 */
function wrapAsync(fn: Function) {
	return (req: Request, res: Response, next: NextFunction) => {
		// Make sure to `.catch()` any errors and pass them along to the `next()`
		// middleware in the chain, in this case the error handler.
		fn(req, res, next).catch(next);
	};
}
export = AppTasksApi;

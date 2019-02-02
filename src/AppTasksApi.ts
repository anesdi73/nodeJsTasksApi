import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { TasksStorage, Task, TaskStatus } from "./TasksStorage";
class AppTasksApi {
	public express: Express;
	private taksStorage: TasksStorage;
	constructor() {
		this.express = express();
		this.express.use(bodyParser.json());
		this.mountRoutes();
		this.taksStorage = new TasksStorage();
	}
	private mountRoutes() {
		this.express.get("/", (req, res) => {
			res.send("Welcome to the Tasks Api");
		});
		this.express.get(
			"/tasks",
			wrapAsync(async (req: Request, res: Response) => {
				const tasks = await this.taksStorage.getTasks();
				res.json(tasks.map(t => this.formatTask(t)));
			})
		);
		this.express.post(
			"/tasks",
			wrapAsync(async (req: Request, res: Response) => {
				const taskToAdd:Task = req.body;
				const addedTask:Task =await this.taksStorage.addTask(taskToAdd);
				res.status(201). json(this.formatTask(addedTask));
			})
        );
        //The route is unknown
		this.express.use((req, res, next) => {
			res.status(404).send("Sorry cant find that!");
        });
        //Error handling
		this.express.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(500).send(error.toString());
		});
	}
	/**
     * Translate status code to text
     *
     * @private
     * @param {Task} task
     * @returns
     * @memberof AppTasksApi
     */
    private formatTask(task: Task) {
		task.taskStatus = TaskStatus[task.taskStatus] as any;
		return task;
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

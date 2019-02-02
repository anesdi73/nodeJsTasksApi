import express, { Express } from "express";
import bodyParser  from 'body-parser';
import { TasksStorage, Task, TaskStatus } from "./TasksStorage";
class AppTasksApi{
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
        this.express.get("/tasks", async (req, res) => {
            const tasks = await this.taksStorage.getTasks();
            res.json(tasks.map(t=>this.formatTask(t)));
         });
    }
    private formatTask(task:Task) {
        task.taskStatus = TaskStatus[task.taskStatus] as any;
        return task;
    }
}
export = AppTasksApi;
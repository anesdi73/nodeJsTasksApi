import  { Mongoose,Document, Schema, Model, model, connect } from "mongoose";
export enum TaskStatus{
    Incomplete,
    Completed,
    Canceled
}
export interface Task{
    description: string;
    taskStatus: TaskStatus;
}
interface TaskDocument  extends Task, Document{

}
const connectionUrl = "mongodb://localhost:27017/tasks";
const tasksModelName = "tasks";
export class TasksStorage{
	
	
	
    private db: Mongoose = null;
    private tasksModel:Model<TaskDocument>=null;
    constructor() {
        
    }
    async initialize() {
        try {
            this.db = await connect(connectionUrl);
            
            var taskSchema = new Schema({
                description: String,
                taskStatus: Number,
            })
            this.tasksModel = this.db.model<TaskDocument>(tasksModelName, taskSchema);
        } catch (error) {
            console.log(`Error initializing data base ${error}`);
        }
         
    }
    async getTasks(): Promise<TaskDocument[]>  {
        return await this.tasksModel.find(); 
    }
    async addTask(taskToAdd: Task): Promise<TaskDocument> {
        return await this.tasksModel.create(taskToAdd);
    }
    async getTask(id: any): Promise<TaskDocument> {
		return await this.tasksModel.findById(id);
    }
    async updateTask(id: any, updatedInfo: any):  Promise<TaskDocument> {
        return await this.tasksModel.findOneAndUpdate({ _id: id }, updatedInfo, { new: true });
    }
    async deleteTask(id: any): Promise<TaskDocument> {
        return await this.tasksModel.findOneAndDelete({ _id: id });
	}
}
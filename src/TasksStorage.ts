export enum TaskStatus{
    Incomplete,
    Completed,
    Canceled
}
export interface Task{
    description: string;
    taskStatus: TaskStatus;
}
export class TasksStorage{
    private tasks: Task[] = [{description:"Clean Dishes",taskStatus:TaskStatus.Incomplete}];
    constructor() {
        
    }
    getTasks(): Promise<Task[]> {
        //throw new Error("Desastre Total");
        return Promise.resolve(this.tasks);
    }
}
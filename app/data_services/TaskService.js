import {Task} from '../utils/data/schema';
import {PatientDataService} from './PatientDataService';
import {generateUUID} from '../utils/utils';

export class TaskService {
    static taskService;

    static initialiseService(floDB) {
        TaskService.taskService = new TaskService(floDB);
    }

    static getInstance() {
        if (!TaskService.taskService) {
            throw new Error('Task service requested before being initialised');
        }

        return TaskService.taskService;
    }

    static getFlatTask(task) {
        return {
            taskID: task.taskID,
            body: task.body,
            patientName: task.patient ? PatientDataService.constructName(task.patient.firstName, task.patient.lastName) : undefined,
            isDone: task.isDone
        };
    }

    constructor(floDB) {
        this.floDB = floDB;
    }

    subscribeToFlatTasksForDay(midnightEpoch, callback) {
        const listener = tasks => {
            callback(tasks.map(task => TaskService.getFlatTask(task)));
        };

        const tasks = this.floDB.objects(Task).filtered('midnightEpoch = $0', midnightEpoch).sorted('isDone');
        listener(tasks);

        tasks.addListener(listener);
        return () => tasks.removeListener(listener);
    }

    editTask(taskBody, taskID) {
        const task = this.floDB.objectForPrimaryKey(Task, taskID);
        if (task) {
            this.floDB.write(() => {
                task.body = taskBody;
            });
        }
    }

    createNewTask(taskBody, midnightEpoch, patient) {
        const taskId = generateUUID();
        this.floDB.write(() => {
            this.floDB.create(Task.schema.name, {
                taskID: taskId,
                body: taskBody,
                midnightEpoch,
                patient,
            });
        });
    }

    flipTaskDoneStatus(taskID) {
        const task = this.floDB.objectForPrimaryKey(Task, taskID);
        if (task) {
            this.floDB.write(() => {
                task.isDone = !task.isDone;
            });
        } else {
            console.log('could not find task for the given id');
        }
    }
}

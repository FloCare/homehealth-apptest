import {Task} from '../Task';

export const TaskSchemaV1 = {
    name: Task.getSchemaName(),
    primaryKey: 'taskID',
    properties: {
        taskID: 'string',
        body: 'string',
        isDone: {type: 'bool', default: false},
        patient: {type: 'Patient'},
        midnightEpoch: 'int',
    }
};

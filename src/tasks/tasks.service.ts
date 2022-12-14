import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }
    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;

        //define a temporary array to hold the result
        let tasks = this.getAllTasks();

        // do somthing with status
        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }
        // do somthing with search
        if (search) {
            tasks = tasks.filter((task) => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true;
                }
                return false;
            })
        }
        return tasks;
    }
    getTaskById(id: string): Task {
        // try to get task
        // if not found,throw an error(404 not found)
        // otherwise,return the found task
        const found = this.tasks.find((task) => task.id === id);
        if (!found) {
            throw new NotFoundException(`Task eith ID "${id}" not found`);
        }
        return found;
    }

    createTask(createTaskDto: createTaskDto): Task {
        const { title, description } = createTaskDto
        const task: Task = {

            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };
        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    updateTaskStatus(id: string, status: TaskStatus) {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
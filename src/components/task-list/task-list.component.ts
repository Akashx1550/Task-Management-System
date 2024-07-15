import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid';
import { Observable } from 'rxjs';
import * as Papa from 'papaparse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  newTask: Partial<Task> = {};
  editedTask: Task | null = null;
  viewingHistoryTaskId: string | null = null;
  hasTasks = false;

  // Sorting variables
  sortBy: string = ''; // Possible values: 'dueDate', 'priority', 'status'
  sortAsc: boolean = true; // Ascending by default

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.tasks$ = this.taskService.getTasks();
    this.tasks$.subscribe(tasks => {
      this.hasTasks = tasks.length > 0;
    });
  }

  addTask(): void {
    const task: Task = {
      id: uuidv4(),
      title: this.newTask.title!,
      description: this.newTask.description || '',
      dueDate: this.newTask.dueDate!,
      priority: this.newTask.priority!,
      status: 'to-do',
      history: [{ date: new Date(), action: 'Task created' }]
    };
    this.taskService.addTask(task).subscribe(() => this.fetchTasks());
    this.newTask = {};
  }

  updateTaskStatus(task: Task, status: Task['status']): void {
    task.status = status;
    task.history.push({ date: new Date(), action: `Status changed to ${status}` });
    this.taskService.updateTask(task).subscribe(() => this.fetchTasks());
  }

  editTask(task: Task): void {
    this.editedTask = { ...task };
  }

  saveTask(): void {
    if (this.editedTask) {
      this.editedTask.history.push({ date: new Date(), action: 'Task edited' });
      this.taskService.updateTask(this.editedTask).subscribe(() => {
        this.fetchTasks();
        this.editedTask = null;
      });
    }
  }

  cancelEdit(): void {
    this.editedTask = null;
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => this.fetchTasks());
  }

  toggleHistory(taskId: string): void {
    this.viewingHistoryTaskId = this.viewingHistoryTaskId === taskId ? null : taskId;
  }

  exportTasksToCSV(): void {
    this.tasks$.subscribe(tasks => {
      const csvData = Papa.unparse(tasks.map(task => ({
        Title: task.title,
        Description: task.description,
        DueDate: task.dueDate,
        Priority: task.priority,
        Status: task.status
      })));

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'tasks.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Sorting methods
  sortTasks(criteria: string): void {
    if (this.sortBy === criteria) {
      this.sortAsc = !this.sortAsc; // Toggle sorting order
    } else {
      this.sortBy = criteria;
      this.sortAsc = true; // Ascending by default for new criteria
    }

    // Perform sorting based on criteria and order
    this.tasks$ = this.tasks$.pipe(map(tasks => this.sortTasksArray(tasks.slice())));
  }

  private sortTasksArray(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => {
      const factor = this.sortAsc ? 1 : -1;
      switch (this.sortBy) {
        case 'dueDate':
          return factor * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        case 'priority':
          return factor * (this.priorityValue(a.priority) - this.priorityValue(b.priority));
        case 'status':
          return factor * (this.statusValue(a.status) - this.statusValue(b.status));
        default:
          return 0;
      }
    });
  }

  private priorityValue(priority: string): number {
    switch (priority) {
      case 'low': return 1;
      case 'medium': return 2;
      case 'high': return 3;
      default: return 0;
    }
  }

  private statusValue(status: string): number {
    switch (status) {
      case 'to-do': return 1;
      case 'in-progress': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  }
}

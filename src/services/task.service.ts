import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'https://task-management-backend-335t.onrender.com/api';
  private axiosInstance: AxiosInstance;

  constructor(private router: Router) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl
    });
  }

  getTasks(): Observable<Task[]> {
    return new Observable(observer => {
      this.axiosInstance.get('/tasks', {
        headers: {
          'authToken' : localStorage.getItem('authToken'),
        },
      })
      .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  addTask(task: Task): Observable<Task[]> {
    return new Observable(observer => {
      // this.axiosInstance.post('/tasks', task)
      // console.log(localStorage.getItem('authToken'))
      this.axiosInstance.post('/tasks', task, {
        headers: {
          'authToken' : localStorage.getItem('authToken'),
        },
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  updateTask(task: Task): Observable<Task[]> {
    console.log(task.id)
    return new Observable(observer => {
      this.axiosInstance.put(`/tasks/${task.id}`, task,{
        headers: {
          'authToken' : localStorage.getItem('authToken'),
        },
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  deleteTask(taskId: string): Observable<Task[]> {
    return new Observable(observer => {
      this.axiosInstance.delete(`/tasks/${taskId}`, {
        headers: {
          'authToken' : localStorage.getItem('authToken'),
        },
      })
        .then(response => {
          observer.next(response.data);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}

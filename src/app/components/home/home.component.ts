import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

interface Task {
  name: string;
  done: boolean;
  date: Date;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [
    { name: "Buy milk", done: false, date: new Date() },
    { name: "Clean the house", done: false, date: new Date() },
    { name: "Go to the gym", done: false, date: new Date() },
    { name: "Learn Angular", done: true, date: new Date() },
  ];
  todoInputText: FormControl = new FormControl(""); 

  constructor() {
    let tasks = localStorage.getItem('tasks');
    if (tasks) {
      let currTasks = this.tasks.map(t => t.name);
      let localTasks = [...JSON.parse(tasks)].filter(t => !currTasks.includes(t.name));
      this.tasks = [...this.tasks, ...localTasks];
    }
  }

  ngOnInit(): void {
    this.todoInputText.valueChanges
    .pipe(debounceTime(500))
    .subscribe((value) => {
      console.log('Input value changed:', value);
      localStorage.setItem('todoInputText', value);
    });
  }

  getDoneTasks() {
    return this.tasks.filter(t => t.done);
  }

  getPendingTasks() {
    return this.tasks.filter(t => !t.done);
  }

  addTask() {
    this.tasks.push({ name: this.todoInputText.value, done: false, date: new Date() });
    this.todoInputText.setValue('');
    this.updateLocalStorage();
  }

  complete(task: Task) {
    this.tasks.find(t => t.name === task.name)!.done = true;
    this.updateLocalStorage();
  }

  remove(task: Task) {
    this.tasks = this.tasks.filter(t => t.name !== task.name);
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  restore(task: Task) {
    this.tasks.find(t => t.name === task.name)!.done = false;
    this.updateLocalStorage();
  }
}

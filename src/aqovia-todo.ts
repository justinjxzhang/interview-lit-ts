import { LitElement, html, css } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import { TodoAddEvent } from './components/aqovia-new-todo-form';

import './components/aqovia-todo-item';
import './components/aqovia-todo-table';
import './components/aqovia-new-todo-form';
import { TodoChangedEvent, TodoDeleteEvent } from './components/aqovia-todo-table';
import { Todo } from './models/todo';

@customElement('aqovia-todo')
export class AqoviaTodo extends LitElement {
  @property({ type: 'string' }) apiUrl = '';

  @state() protected todoItems: Todo[] = []

  static styles = css`
    :host {
      padding: 2em;
      display:flex;
      justify-content: center;

    }

    main {
      display: flex;
      flex-direction: column;
      width: 60em;
    }

    aqovia-new-todo-form {
      width: 30em;
      align-self: center;
    }
  `;

  constructor() {
    super();
    this.handleAddCallback = this.handleAddCallback.bind(this);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.loadTodos();
  }

  async loadTodos(delayMs = 0): Promise<void> {
    return new Promise((resolve, reject) => {
      // Simulate slow network speed
      setTimeout(async () => {
        const response = await fetch(new URL('todo', this.apiUrl), {
          method: 'GET'
        });
    
        if (response.ok) {
          const x : Todo[] = await response.json();
          this.todoItems = [...x];
          resolve();
        }
        else {
          reject()
        }
      }, delayMs)
    })
  }

  async onChangeTodo(event: TodoChangedEvent) {
    const response = await fetch(new URL(`todo/${event.detail.todo.id}`, this.apiUrl), {
      method: 'put',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(event.detail.todo),
    });

   if (response.ok) {
    const reloadReq = this.loadTodos(5000);
    const existingIdx = this.todoItems.findIndex(x => x.id == event.detail.todo.id);
    this.todoItems[existingIdx] = event.detail.todo;
    this.todoItems = [...this.todoItems]
    
    await reloadReq;
   }
  }

  async onDeleteTodo(event: TodoDeleteEvent) {
    const response = await fetch(new URL(`todo/${event.detail.id}`, this.apiUrl), {
      method: 'delete',
    });

    if (response.ok) {
      const reloadReq = this.loadTodos(5000);
      this.todoItems = [...this.todoItems.filter(item => item.id != event.detail.id)]; 
      await reloadReq;
    }
  }

  async onAddTodo(event: TodoAddEvent) {
    const response = await fetch(new URL('todo', this.apiUrl), {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event.detail.todo)
    });

    if (response.ok) {
      this.loadTodos(5000);
    }
  }

  async handleAddCallback(description: string) {
    const response = await fetch(new URL('todo', this.apiUrl), {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: false,
        description
      })
    });

    if (response.ok) {
      this.loadTodos(5000);
    }
  }

  render() {
    return html`
      <main>
        <h1>Aqovia Todo App</h1>
        <aqovia-new-todo-form
          @TodoAddEvent="${this.onAddTodo}"
          .callbackFunc="${this.handleAddCallback}"
        ></aqovia-new-todo-form>
        <hr/>
        <aqovia-todo-table 
          .todoItems="${this.todoItems}"
          @TodoChangedEvent="${this.onChangeTodo}"
          @TodoDeleteEvent="${this.onDeleteTodo}"
        ></aqovia-todo-table>
      </main>
    `;
  }
}
import { css, html, LitElement, PropertyValueMap, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HtmlInputElementChangedEvent } from "../../helpers/polyfills";
import { Todo } from "../../models/todo";

declare global { interface HTMLElementTagNameMap { 'aqovia-todo-table': AqoviaTodoTable } }

@customElement('aqovia-todo-table')
export class AqoviaTodoTable extends LitElement
{
    static styles = css`
        #filters {
            width: 100%;
            display: flex;
            justify-content: end;
        }

        table {
            width: 100%;
        }
    `;

    @property({ attribute: false }) todoItems: Todo[] = [];

    @state() hideCompleted = false;


    get shownItems(): Todo[] {
        return [...this.todoItems.filter(x => !this.hideCompleted || !x.completed)];
    }

    handleShowCompleted(e: HtmlInputElementChangedEvent): void {
        this.hideCompleted = e.currentTarget.checked;
    }

    handleUpdateCompletionState(e: HtmlInputElementChangedEvent, todoId: string): void {
        const todoItem = this.todoItems.find(i => i.id === todoId);
        const event = new CustomEvent('TodoChangedEvent', {
            detail: {
                todo: {
                    ...todoItem,
                    completed: e.currentTarget.checked
                }
            }
        })
        this.dispatchEvent(event);
    }
    
    handleDelete(todoId: string): void {
        const event = new CustomEvent('TodoDeleteEvent', {
            detail: {
                id: todoId
            }
        });
        this.dispatchEvent(event);
    }

    render(): TemplateResult {
        return html`
        <div id="filters">
            <label>Hide completed<input type="checkbox" ?checked="${this.hideCompleted}" @change="${this.handleShowCompleted}"></input></label>
        </div>
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Completed</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${this.shownItems.map(todoItem => html`
                        <tr>
                            <td><pre>${todoItem.id}</pre></td>
                            <td>
                                <input 
                                    type="checkbox"
                                    ?checked="${todoItem.completed}"
                                    @change="${(e: HtmlInputElementChangedEvent) => this.handleUpdateCompletionState(e, todoItem.id)}"
                                ></input>
                            </td>
                            <td>${todoItem.description}</td>
                            <td><button @click="${() => this.handleDelete(todoItem.id)}">Delete</button></td>
                        </tr>
                    `)}
                </tbody>
            </table>
        </div>
        `
    }
}

export type TodoChangedEvent = CustomEvent<{ todo: Todo }>;
export type TodoDeleteEvent = CustomEvent<{ id: string }>;
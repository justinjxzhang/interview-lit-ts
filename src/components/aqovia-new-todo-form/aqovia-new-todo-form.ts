import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HtmlInputElementChangedEvent } from "../../helpers/polyfills";
import { Todo } from "../../models/todo";

declare global { interface HTMLElementTagNameMap { 'aqovia-new-todo-form': AqoviaNewTodoForm } }

@customElement('aqovia-new-todo-form')
export class AqoviaNewTodoForm extends LitElement 
{
    static styles = css`
        section#newTodo .controls {
            display:flex;
        }

        section#newTodo .controls > * {
            flex: 1;
        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 1em;
        }

        .form-row,
        .buttons {
            display:flex;
            gap: 1em;
        }

        .form-row > input[type=text],
        .buttons > * {
            flex: 1;
        }
    `;
    
    @property({ attribute: false }) callbackFunc: (description: string) => void = (id: string) => Function.prototype;

    newTodoDescription = '';
    
    handleNewTodoTextChange(e: HtmlInputElementChangedEvent) {
        this.newTodoDescription = e.currentTarget.value;
    }

    handleAdd(e: PointerEvent) {
        const event = new CustomEvent('TodoAddEvent', {
            detail: {
                todo: {
                    completed: false,
                    description: this.newTodoDescription
                }
            }
        });

        this.dispatchEvent(event);
    }

    handleAddCallback() {
        this.callbackFunc(this.newTodoDescription);
    }

    render(): TemplateResult {
        return html`
            <h3>Add new Todo</h3>
            <div class="form">
                <div class="form-row">
                    <label for="description">Description</label>
                    <input id="description" type="text" @input="${this.handleNewTodoTextChange}"></input>
                </div>
                <div class="buttons">
                    <button @click="${this.handleAddCallback}">Add (Callback)</button>
                    <button @click="${this.handleAdd}">Add (CustomEvent)</button>
                </div>
            </div>
        `
    }
}

export type TodoAddEvent = CustomEvent<{ todo: Todo }>;
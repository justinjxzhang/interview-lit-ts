import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { Todo } from '../../models/todo';

declare global {
    interface HTMLElementTagNameMap {
        'aqovia-todo-item': AqoviaTodoItem
    }
}

@customElement('aqovia-todo-item')
export class AqoviaTodoItem extends LitElement
{
    @property({ attribute: false }) todo: Todo | null = null;

    render(): TemplateResult {
        return html`
        <div>
            <div>${this.todo?.id}</div>
            <div>${this.todo?.completed}</div>
            <div>${this.todo?.description}</div>
        </div>
        `;
    }
}
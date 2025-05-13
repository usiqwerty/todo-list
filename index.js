function createElement(tag, attributes, children, onClick, onChange) {
    const element = document.createElement(tag);

    if (attributes) {
        Object.keys(attributes).forEach((key) => {
            element.setAttribute(key, attributes[key]);
        });
    }

    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (typeof child === "string") {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === "string") {
        element.appendChild(document.createTextNode(children));
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }
    if (onClick !== undefined) {
        element.addEventListener('click', onClick);
    }
    if (onChange !== undefined) {
        element.addEventListener('change', onChange);
    }
    return element;
}

class Component {
    constructor() {
        this._domNode = null;
    }

    getDomNode() {
        this._domNode = this.render();
        return this._domNode;
    }

    update() {
        const newDomNode = this.render();
        this._domNode.replaceWith(newDomNode);
        this._domNode = newDomNode;
    }
}

class TodoList extends Component {
    constructor() {
        super();
        this.state = ["Сделать домашку", "Сделать практику", "Пойти домой"];
        this.currentInputValue = "";
    }

    renderRecursion(state) {
        let children = state.children;
        if (typeof state.children === 'object') {
            children = state.children.map(c => this.renderRecursion(c));
        }
        return createElement(state.tag, state.attrs, children, state.onClick, state.onChange);
    }

    render() {
        const elementStructure = {
            tag: "div", attrs: {class: 'todo-list'}, children: [
                {tag: 'h1', attrs: {}, children: 'TODO List'},
                {
                    tag: 'div', attrs: {class: "add-todo"}, children: [
                        {
                            tag: 'input',
                            attrs: {id: 'new-todo', type: 'text', placeholder: 'Задание', value: this.currentInputValue},
                            onChange: this.onAddInputChange.bind(this)
                        },
                        {tag: "button", attrs: {id: "add-btn"}, children: "+", onClick: this.onAddTask.bind(this)}
                    ]
                },
                {
                    tag: 'ul', attrs: {id: 'todos'}, children: this.state.map(
                        label => ({
                            tag: 'li', attrs: {}, children: [
                                {tag: 'input', attrs: {type: 'checkbox'}},
                                {tag: 'label', attrs: {}, children: label},
                                {
                                    tag: 'button', attrs: {}, children: '🗑️', onClick:
                                        () => {
                                            this.state = this.state.filter(x => x !== label);
                                            this.update();
                                        }
                                },
                            ]
                        })
                    )
                }
            ]
        };
        return this.renderRecursion(elementStructure);
    }

    onAddTask() {
        if (this.currentInputValue.trim()) {
            this.state.push(this.currentInputValue);
            this.currentInputValue = "";
            this.update();
        }
    }

    onAddInputChange(e) {
        this.currentInputValue = e.target.value;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});
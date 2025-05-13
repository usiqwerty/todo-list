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

    _build(struct) {
        const c = Array.isArray(struct.children)
            ? struct.children.map(ch => typeof ch === 'object' && ch.tag
                ? this._build(ch)
                : ch)
            : struct.children;
        return createElement(struct.tag, struct.attrs, c,
            struct.onClick, struct.onChange);
    }
}

class AddTask extends Component {
    constructor(onAddTask) {
        super();
        this.onAddTask = onAddTask;
        this.inputValue = '';
    }

    handleInput(e)   { this.inputValue = e.target.value; }
    handleAdd() {
        if (!this.inputValue.trim()) return;
        this.onAddTask(this.inputValue.trim());
        this.inputValue = '';
        this.update();
    }

    render() {
        return this._build({
            tag: 'div', attrs: {class: 'add-todo'}, children: [
                {
                    tag: 'input',
                    attrs: {type: 'text', placeholder: 'Задание', value: this.inputValue},
                    onChange: this.handleInput.bind(this)
                },
                {
                    tag: 'button', attrs: {}, children: '+',
                    onClick: this.handleAdd.bind(this)
                }
            ]
        });
    }
}

class Task extends Component {
    constructor(label, isCompleted, onToggle, onDelete) {
        super();
        this.label       = label;
        this.isCompleted = isCompleted;
        this.onToggle    = onToggle;
        this.onDelete    = onDelete;
    }

    render() {
        return this._build({
            tag:'li', attrs:{}, children:[
                {
                    tag:'input',
                    attrs:{type:'checkbox', ...(this.isCompleted ? {checked:true}:{})},
                    onClick: this.onToggle
                },
                {
                    tag:'label',
                    attrs:{class: this.isCompleted ? 'complete' : ''},
                    children: this.label
                },
                {
                    tag:'button', attrs:{}, children:'🗑',
                    onClick: this.onDelete
                }
            ]
        });
    }
}

class TodoList extends Component {
    constructor() {
        super();
        this.tasks         = ['Сделать домашку','Сделать практику','Пойти домой'];
        this.completed     = new Set();  
    }

    addTask = (text) => {
        this.tasks.push(text);
        this.update();
    }

    toggleTask = (label) => {
        this.completed.has(label) ? this.completed.delete(label)
            : this.completed.add(label);
        this.update();
    }

    deleteTask = (label) => {
        this.tasks = this.tasks.filter(l => l !== label);
        this.completed.delete(label);
        this.update();
    }

    render() {
        const addTaskCmp = new AddTask(this.addTask);
        const taskNodes = this.tasks.map(label => {
            const taskCmp = new Task(
                label,
                this.completed.has(label),
                () => this.toggleTask(label),
                () => this.deleteTask(label)
            );
            return taskCmp.getDomNode();
        });
        
        return createElement(
            'div', {class:'todo-list'}, [
                createElement('h1', {}, 'TODO List'),
                addTaskCmp.getDomNode(),
                createElement('ul', {id:'todos'}, taskNodes)
            ]
        );
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(new TodoList().getDomNode());
});
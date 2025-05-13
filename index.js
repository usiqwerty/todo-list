function createElement(tag, attributes, children) {
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

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  state;
  constructor() {
    super();
    this.state = {
      tag: "div", attrs: {class: 'todo-list'}, children: [
        {tag: 'h1', attrs: {}, children: 'TODO List'},
        {tag: 'div', attrs: { class: "add-todo" }, children: [
            {tag: 'input', attrs: {id: 'new-todo', type: 'text', placeholder: 'Задание'}},
            {tag:"button", attrs: { id: "add-btn" }, children: "+"}
          ]
        },
        {tag: 'ul', attrs: {id:'todos'}, children: ["Сделать домашку","Сделать практику", "Пойти домой"].map(
              label => ({tag: 'li', attrs: {}, children: [
                  {tag: 'input', attrs:{type:'checkbox'}},
                  {tag: 'label', attrs:{}, children: label},
                  {tag: 'button', attrs:{}, children: '🗑️'},
                ]})
          )}
      ]
    }

  }
  renderState(state){
      let children = state.children;
      if (typeof state.children === 'object') {
          children = state.children.map(c=>this.renderState(c));
      }
      return createElement(state.tag, state.attrs, children);
  }
  render() {
    return this.renderState(this.state);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});

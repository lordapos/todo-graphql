const app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      isDark: true,
      show: true,
      newTodo: '',
      todos: [],
      day: this.todoDay(),
      date: new Date().getDate(),
      ord: this.nth(new Date().getDate()),
      year: new Date().getFullYear()
    };

  },
  created() {
    const query = `
      query {
        getTodos {
          id title done createdAt updatedAt
        }
      }
    `

    fetch('/graphql', {
      method: 'post',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify({query})
    })
        .then(res => res.json())
        .then(response => {
          this.todos = response.data.getTodos
        })
  },
  methods: {
    addTodo() {
      const title = this.newTodo && this.newTodo.trim();
      if (!title) {
        return;
      }
      fetch('/api/todo', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title})
      })
          .then(res => res.json())
          .then(({todo}) => {
            this.todos.push(todo)
            this.newTodo = '';
          })
          .catch(e => console.log(e))
    },
    removeTodo(id) {
      fetch('/api/todo/' + id, {
        method: 'delete'
      })
          .then(() => {
            this.todos = this.todos.filter(t => t.id !== id)
          })
          .catch(e => console.log(e))
    },
    todoDay() {
      var d = new Date();
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return days[d.getDay()];
    },
    completeTodo(id) {
      fetch('/api/todo/' + id, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({done: true})
      })
          .then(res => res.json())
          .then(({todo}) => {
            const idx = this.todos.findIndex(t => t.id === todo.id)
            this.todos[idx].updatedAt = todo.updatedAt
          })
          .catch(e => console.log(e))
    },
    nth(d) {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:return "st";
        case 2:return "nd";
        case 3:return "rd";
        default:return "th";}

    } },

  filters: {
    capitalize: function (value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    date(value, withTime) {
      const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
      }

      if (withTime) {
        options.hour = '2-digit'
        options.minute = '2-digit'
        options.second = '2-digit'
      }
      return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
    }
  } });
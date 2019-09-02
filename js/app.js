;(function () {

  //这里注册全局的自定义指令
  // Vue.directive('focus', {
  //   inserted: function (el) {
  //     // 聚焦元素
  //     //自定义指令总共有五个钩子函数 每一个钩子函数都有2个参数
  //     //第一个参数是el 表示当前的DOM 第二个属性是bingding 表示当前的对象
  //     el.focus()
  //   }
  // })
  Vue.directive('my-focus',{
    inserted(el){
      el.focus();
    }
  });

 Vue.directive('todo-focus',{
    update(el,binding){
      el.focus();
    }
  });


  window.app = new Vue({
    data: {
      todos: JSON.parse(window.localStorage.getItem('todos') || '[]'),
      currentEditing: null,
      filterTxet: ''
    },

    methods: {
      handleNewTodoKeyDown(e) {
        // 0. 注册按下的回车事件
        // 1. 获取文本框的内容
        // 2. 数据校验
        // 3. 添加到 todocs 列表
        // 4. 清空文本框
        // console.log(this.todoText)
        const target = e.target
        const value = target.value.trim()
        if (!value.length) {
          return
        }
        const todos = this.todos
        todos.push({
          // 如果数组是空的就给 1 ，否则就是最后一个元素的 id + 1
          id: todos.length ? todos[todos.length - 1].id + 1 : 1,
          title: value,
          completed: false
        })
        target.value = ''
      },

      handleToggleAllChange(e) {
        // 0. 绑定 checkbox 的 change 事件
        // 1. 获取 checkbox 的选中的状态
        // 2. 直接循环所有的子任务项的选中状态设置为 toggleAll 的状态

        this.todos.forEach(function (item, i) {
          item.completed = e.target.checked;
        })
      },

      handleRemoveTodoClick(index, e) {
        this.todos.splice(index, 1)
      },

      handleGetEditingDblclick(todo) {
        // 把这个变量等于当前双击的 todo
        this.currentEditing = todo;

      },

      // 编辑任务，敲回车保存编辑
      handleSaveEditKeydown(todo, index, e) {
        // 0. 注册绑定事件处理函数
        // 1. 获取编辑文本框的数据
        // 2. 数据校验
        //    如果数据是空的，则直接删除该元素
        //    否则保存编辑
        const target = e.target
        const value = target.value.trim()

        // 数据被编辑为空的了，直接删除
        if (!value.length) {
          this.todos.splice(index, 1)
        } else {
          todo.title = value
          this.currentEditing = null
        }
      },

      handleCancelEditEsc() {
        // 1. 把样式给去除
        this.currentEditing = null
      },

      handleClearAllDoneClick() {
        // 错误的写法
        // this.todos.forEach((item, index) => {
        //   if (item.completed) {
        //     this.todos.splice(index, 1)
        //   }
        // })

        // 手动控制遍历索引的方式
        // for (let i = 0; i < this.todos.length; i++) {
        //   if (this.todos[i].completed) {
        //     this.todos.splice(i, 1)
        //     // 删除元素之后，让我们遍历的这个 小索引 往后倒退一次，
        //     // 因为你删除之后，后面的所有元素的索引都会倒退一次
        //     // 纠正索引的遍历
        //     i--
        //   }
        // }

        // 过滤结果的方式
        // 我们这里还有一种办法也很简单
        // 我们把需要的结果给过滤出来重新赋值到 todos 中
        this.todos = this.todos.filter(t => !t.completed)
      },
      //点击选中所有
    },

    computed: {
      leftNum: {
        get() {
          return this.todos.filter(t => !t.completed).length
        }
      },
      toggleAll: {
        get() {
          //如果是每个选项都被选上 则返回true
          return this.todos.every(t => t.completed)
        },

      },
      filterTodos: {
        get() {
          //1如果是all return todos
          //2如果是active return this.todos.filter(t => !t.completed)
          //3如果是comleted return this.todos.filter(t => t.completed)
          switch (this.filterTxet) {
            default :
              return this.todos
              break;
            case 'active':
              return this.todos.filter(t => !t.completed)
              break;
            case 'completed':
              return this.todos.filter(t => t.completed)
              break;
          }
        }
      }

    },
    watch: {
      //监听todos的改变 当todos发生了改变 就吧todos存入本地存储
      //这里是深度监听
      todos: {

        //当todos改变时 系统监听到 会自动地去调用handler方法
        handler(val,oldval) {

          window.localStorage.setItem('todos', JSON.stringify(this.todos))
        },
        deep: true
        // immediate:true 无论变化了没有 一上来就开始调用
      }
    }

  }).$mount('#app');
  //这个方法是监听url地址上哈希值的改变
  handleHash()
  window.onhashchange = handleHash;
  function handleHash(){
    // console.log(window.location.hash.substr(2)) 获取到#/后面的值
    app.filterTxet = window.location.hash.substr(2)
  }


})()

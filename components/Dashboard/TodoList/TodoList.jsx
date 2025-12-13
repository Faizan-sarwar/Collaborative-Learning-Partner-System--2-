import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TodoList.module.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const saveTodos = (updated) => {
    setTodos(updated);
    localStorage.setItem('todos', JSON.stringify(updated));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
        date: new Date().toLocaleDateString(),
        status: 'Pending'
      };
      saveTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, status: !todo.completed ? 'Done' : 'Pending' } : todo
    );
    saveTodos(updated);
  };

  const deleteTodo = (id) => {
    saveTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const updated = todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      );
      saveTodos(updated);
    }
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.icon}>📋</span>
          <h3 className={styles.title}>To-do List</h3>
        </div>
        <button className={styles.addBtn} onClick={() => document.getElementById('todoInput').focus()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      
      <p className={styles.subtitle}>Check off your todos and feel good!</p>

      <div className={styles.inputWrapper}>
        <input
          id="todoInput"
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className={styles.input}
        />
      </div>

      <div className={styles.todoList}>
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
            >
              <button 
                className={styles.checkbox}
                onClick={() => toggleTodo(todo.id)}
              >
                {todo.completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                  className={styles.editInput}
                  autoFocus
                />
              ) : (
                <div className={styles.todoContent}>
                  <span className={styles.todoText}>{todo.text}</span>
                  <div className={styles.todoMeta}>
                    <span className={`${styles.status} ${todo.completed ? styles.done : ''}`}>
                      {todo.status}
                    </span>
                    <span className={styles.date}>{todo.date}</span>
                  </div>
                </div>
              )}
              
              <div className={styles.todoActions}>
                <button onClick={() => startEdit(todo)} className={styles.editBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button onClick={() => deleteTodo(todo.id)} className={styles.deleteBtn}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className={styles.emptyState}>
            <span>No tasks yet. Add your first task above!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;

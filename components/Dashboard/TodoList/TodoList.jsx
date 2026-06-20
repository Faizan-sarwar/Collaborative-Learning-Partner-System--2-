import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, Plus, Edit2, Trash2, Check } from 'lucide-react';
import styles from './TodoList.module.css';

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  //  ENTERPRISE LOGIC: Safely increment tasks & XP in the DB
  const saveStatsToDB = async (updatedTodos) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    const completedCount = updatedTodos.filter(t => t.completed).length;
    const prevCompleted = todos.filter(t => t.completed).length;
    const isCompletion = completedCount > prevCompleted;

    if (isCompletion) {
      try {
        const res = await fetch(`http://${window.location.hostname}:5000/api/auth/track-time`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // We use our safe delta route to just add 30 XP
            body: JSON.stringify({ xp: 30, tasksCompleted: 1 }) 
        });

        if (res.ok) {
            // Tell the Header and Sidebar to update their numbers!
            window.dispatchEvent(new Event('userUpdated'));
            
            // Trigger a local success notification
            const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
            notifs.unshift({
                id: Date.now(), title: "Task Completed! ✅", message: "You earned 30 XP", type: 'success', read: false, timestamp: new Date()
            });
            localStorage.setItem('notifications', JSON.stringify(notifs));
            window.dispatchEvent(new Event('notificationAdded'));
        }
      } catch (err) { console.error("Failed to sync tasks", err); }
    }
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = { id: Date.now(), text: newTodo.trim(), completed: false, date: new Date().toLocaleDateString(), status: 'Pending' };
      const updated = [todo, ...todos];
      setTodos(updated);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, status: !todo.completed ? 'Done' : 'Pending' } : todo
    );
    setTodos(updated);
    saveStatsToDB(updated); 
  };

  const deleteTodo = (id) => setTodos(todos.filter(todo => todo.id !== id));

  const startEdit = (todo) => { setEditingId(todo.id); setEditText(todo.text); };
  const cancelEdit = () => { setEditingId(null); setEditText(''); };
  const saveEdit = () => {
    if (editText.trim()) setTodos(todos.map(todo => todo.id === editingId ? { ...todo, text: editText.trim() } : todo));
    setEditingId(null); setEditText('');
  };

  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <CheckSquare className={styles.icon} size={20} />
          <h3 className={styles.title}>Tasks & Goals</h3>
        </div>
        <button className={styles.addBtn} onClick={() => inputRef.current?.focus()}>
          <Plus size={16} />
        </button>
      </div>
      
      <p className={styles.subtitle}>Check off tasks to earn 30 XP!</p>

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef} type="text" placeholder="Add a new task..." value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          className={styles.input}
        />
      </div>

      <div className={styles.todoList}>
        <AnimatePresence mode='popLayout'>
          {sortedTodos.map((todo) => (
            <motion.div
              key={todo.id} layout
              className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            >
              <button className={styles.checkbox} onClick={() => toggleTodo(todo.id)}>
                {todo.completed && <Check size={14} strokeWidth={3} />}
              </button>
              
              {editingId === todo.id ? (
                <input
                  type="text" value={editText} onChange={(e) => setEditText(e.target.value)}
                  onBlur={saveEdit} onKeyDown={(e) => e.key === 'Enter' ? saveEdit() : e.key === 'Escape' ? cancelEdit() : null}
                  className={styles.editInput} autoFocus
                />
              ) : (
                <div className={styles.todoContent}>
                  <span className={styles.todoText}>{todo.text}</span>
                  <div className={styles.todoMeta}>
                    <span className={`${styles.status} ${todo.completed ? styles.done : ''}`}>{todo.status}</span>
                    <span className={styles.date}>{todo.date}</span>
                  </div>
                </div>
              )}
              
              <div className={styles.todoActions}>
                <button onClick={() => startEdit(todo)} className={styles.editBtn}><Edit2 size={14} /></button>
                <button onClick={() => deleteTodo(todo.id)} className={styles.deleteBtn}><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && <div className={styles.emptyState}>No tasks yet. You're all caught up!</div>}
      </div>
    </div>
  );
};

export default TodoList;
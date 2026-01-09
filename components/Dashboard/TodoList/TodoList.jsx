import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TodoList.module.css';

const TodoList = () => {
  // 1. Lazy Initialization
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // 2. React Ref
  const inputRef = useRef(null);

  // 3. Auto-Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 🟢 4. HELPER: Save Completed Count AND XP to DB
  const saveStatsToDB = async (updatedTodos) => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return;

    // Get current completed count
    const completedCount = updatedTodos.filter(t => t.completed).length;
    
    // Get previous count (to calculate if we gained XP)
    const prevCompleted = todos.filter(t => t.completed).length;
    const isCompletion = completedCount > prevCompleted;

    // Get Current XP from Session (safest way without another fetch)
    const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    let currentXP = storedUser.xp || 0;

    // 🟢 XP Logic: +30 XP for completing a task
    if (isCompletion) {
        currentXP += 30;
    }

    try {
        await fetch('http://localhost:5000/api/auth/update-stats', {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tasksCompleted: completedCount,
                xp: currentXP 
            })
        });

        // Sync Session Storage
        storedUser.tasksCompleted = completedCount;
        storedUser.xp = currentXP;
        sessionStorage.setItem('user', JSON.stringify(storedUser));
        
        // Notify Header/Gamification
        window.dispatchEvent(new Event('userUpdated'));

        // Notification for XP
        if (isCompletion) {
             const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
             const newNotif = {
                 id: Date.now(), 
                 title: "Task Completed! ✅", 
                 message: "You earned 30 XP", 
                 type: 'success', 
                 read: false, 
                 timestamp: new Date()
             };
             localStorage.setItem('notifications', JSON.stringify([newNotif, ...notifs]));
             window.dispatchEvent(new Event('notificationAdded'));
        }

    } catch (err) {
        console.error("Failed to sync tasks to DB", err);
    }
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
      const updated = [todo, ...todos];
      setTodos(updated);
      saveStatsToDB(updated); // Sync
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    const updated = todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, status: !todo.completed ? 'Done' : 'Pending' } 
        : todo
    );
    setTodos(updated);
    saveStatsToDB(updated); // Sync & Add XP
  };

  const deleteTodo = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    setTodos(updated);
    saveStatsToDB(updated); // Sync
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = () => {
    if (editText.trim()) {
      const updated = todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      );
      setTodos(updated);
    }
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const sortedTodos = [...todos].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.icon}>📋</span>
          <h3 className={styles.title}>To-do List</h3>
        </div>
        <button className={styles.addBtn} onClick={() => inputRef.current?.focus()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      
      <p className={styles.subtitle}>Check off your todos and feel good!</p>

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
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
        <AnimatePresence mode='popLayout'>
          {sortedTodos.map((todo) => (
            <motion.div
              key={todo.id}
              className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
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
                  onKeyDown={handleEditKeyDown}
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
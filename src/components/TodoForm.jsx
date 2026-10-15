import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Check, X, Calendar, AlertCircle } from 'lucide-react';
import './TodoForm.css';

const TodoForm = () => {
    // Helper function to get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Load tasks from localStorage or default to empty array
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    // Form input states
    const [input, setInput] = useState('');
    const [dueDate, setDueDate] = useState(() => getTodayDate());
    const [priority, setPriority] = useState('Medium'); // Low, Medium, High

    // Filter state ('all', 'active', 'completed')
    const [filter, setFilter] = useState('all');

    // Edit states
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    // Save to localStorage whenever todos change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // Add a new task
    const addTask = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newTodo = {
            id: Date.now(),
            text: input,
            completed: false,
            dueDate: dueDate || 'No due date',
            priority: priority,
        };

        setTodos([...todos, newTodo]);
        setInput('');
        setDueDate(getTodayDate());
        setPriority('Medium');
    };

    // Toggle completion status
    const toggleComplete = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    // Delete task
    const deleteTask = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    // Start editing a task
    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditText(todo.text);
    };

    // Save edited task
    const saveEdit = (id) => {
        if (!editText.trim()) return;
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, text: editText } : todo
            )
        );
        setEditingId(null);
        setEditText('');
    };

    // Filter tasks based on active tab
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // 'all'
    });

    // Task counters
    const totalTasks = todos.length;
    const completedTasks = todos.filter((t) => t.completed).length;

    return (
        <div className="todo-container">
            <h1 className="todo-title">My To-Do List</h1>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="todo-form">
                <div className="input-group">
                    <input
                        type="text"
                        className="todo-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your task..."
                    />
                </div>

                <div className="form-controls">
                    <div className="control-item">
                        <label>Due Date:</label>
                        <input
                            type="date"
                            className="date-input"
                            value={dueDate}
                            min={getTodayDate()}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="control-item">
                        <label>Priority:</label>
                        <select
                            className="priority-select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="add-btn">Add Task</button>
            </form>

            {/* Task Summary Counter */}
            <div className="todo-stats">
                <span>Total: <strong>{totalTasks}</strong></span>
                <span>Completed: <strong>{completedTasks}</strong></span>
            </div>

            {/* Filter Tabs */}
            <div className="filter-buttons">
                <button
                    className={filter === 'all' ? 'active-tab' : ''}
                    onClick={() => setFilter('all')}
                >
                    All
                </button>
                <button
                    className={filter === 'active' ? 'active-tab' : ''}
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button
                    className={filter === 'completed' ? 'active-tab' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Task List */}
            <ul className="todo-list">
                {filteredTodos.length === 0 ? (
                    <p className="empty-msg">No tasks found.</p>
                ) : (
                    filteredTodos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <div className="todo-main-content">
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleComplete(todo.id)}
                                    className="todo-checkbox"
                                />

                                {editingId === todo.id ? (
                                    <div className="edit-container">
                                        <input
                                            type="text"
                                            className="edit-input"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                        <button onClick={() => saveEdit(todo.id)} className="icon-btn save-btn">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="icon-btn cancel-btn">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="todo-details">
                                        <span className="todo-text">{todo.text}</span>
                                        <div className="todo-meta">
                                            <span className={`priority-badge ${(todo.priority || 'Medium').toLowerCase()}`}>
                                                {todo.priority || 'Medium'}
                                            </span>
                                            <span className="due-date-badge">
                                                <Calendar size={12} /> {todo.dueDate}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="todo-actions">
                                {editingId !== todo.id && (
                                    <button
                                        onClick={() => startEditing(todo)}
                                        className="action-btn edit-btn"
                                        title="Edit task"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteTask(todo.id)}
                                    className="action-btn delete-btn"
                                    title="Delete task"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodoForm;
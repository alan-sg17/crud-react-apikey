import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import BotonPrimario from './components/BotonPrimario';
import Navegacion from './components/Navegacion';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
    const [currentTask, setCurrentTask] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskActionTrigger, setTaskActionTrigger] = useState(0);

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setShowTaskForm(true);
    };

    const handleSaveTask = () => {
        setCurrentTask(null);
        setShowTaskForm(false);
        setTaskActionTrigger(prev => prev + 1);
    };

    const handleCancelEdit = () => {
        setCurrentTask(null);
        setShowTaskForm(false);
    };

    return (
        <div className='min-h-screen flex flex-col items-center bg-gray-100 p-4'>
            <nav className="bg-blue-800 p-4 shadow-md w-full">
                <div className="container mx-auto flex items-center justify-between">
                    <Link to="/" className="text-white text-2xl font-bold hover:text-blue-200 transition duration-300">
                        Gestor de Tareas
                    </Link>
                    <div className="flex space-x-6">
                        <Link to="/" className="text-white hover:text-blue-200 text-lg transition duration-300">Inicio</Link>
                        <Link to="/tareas" className="text-white hover:text-blue-200 text-lg transition duration-300">Tareas</Link>
                    </div>
                </div>
            </nav>

            <main className='flex flex-col items-center p-4 w-full max-w-7xl mx-auto'>
                <Routes>
                    <Route path="/" element={
                        <>
                            <h1 className='text-5xl font-extrabold text-blue-700 mb-8'>Gestor de Tareas</h1>
                            <p className='mt-12 text-gray-600'>Bienvenido al sistema de gestión de tareas. Organiza y realiza un seguimiento de tus actividades.</p>
                        </>
                    } />
                    
                    <Route path="/tareas" element={
                        <>
                            <h1 className='text-5xl font-extrabold text-blue-700 mb-8'>Gestión de Tareas</h1>
                            {!showTaskForm && (
                                <div className="mb-8">
                                    <BotonPrimario 
                                        texto="Crear Nueva Tarea" 
                                        onClick={() => setShowTaskForm(true)} 
                                    />
                                </div>
                            )}
                            {showTaskForm && (
                                <TaskForm
                                    currentTask={currentTask}
                                    onSave={handleSaveTask}
                                    onCancel={handleCancelEdit}
                                />
                            )}
                            <TaskList
                                onEditTask={handleEditTask}
                                onTaskCreatedOrUpdated={taskActionTrigger}
                            />
                        </>
                    } />
                
                    
                    <Route path="*" element={
                        <h2 className='text-4xl font-bold text-gray-800 mt-12 mb-8 text-red-500'>
                            404 - Página no encontrada
                        </h2>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App;
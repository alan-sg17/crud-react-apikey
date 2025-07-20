import React, { useState, useEffect } from "react";
import BotonPrimario from "./BotonPrimario";
import taskService from "../services/taskService";
import Swal from "sweetalert2";

const TaskForm = ({ currentTask, onSave, onCancel }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: ""
  });

  useEffect(() => {
    if (currentTask) {
      setTask({
        ...currentTask,
        due_date: currentTask.due_date ? currentTask.due_date.split('T')[0] : ""
      });
    } else {
      setTask({
        title: "",
        description: "",
        status: "pending",
        due_date: ""
      });
    }
  }, [currentTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title || !task.status) {
      Swal.fire("Error", "Título y estado son obligatorios.", "error");
      return;
    }

    try {
      if (currentTask) {
        await taskService.updateTask(task.id, task);
        Swal.fire("¡Actualizado!", "Tarea actualizada exitosamente.", "success");
      } else {
        await taskService.createTask(task);
        Swal.fire("¡Creada!", "Tarea creada exitosamente.", "success");
      }
      onSave();
    } catch (error) {
      console.error("Error saving task:", error);
      Swal.fire("Error", error.message || "Hubo un error al guardar la tarea.", "error");
    }
  };

  return (
    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        {currentTask ? "Editar Tarea" : "Crear Nueva Tarea"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Título:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Descripción:
          </label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
            Estado:
          </label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="pending">Pendiente</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
        <div>
          <label htmlFor="due_date" className="block text-gray-700 text-sm font-bold mb-2">
            Fecha límite:
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={task.due_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <BotonPrimario
            texto={currentTask ? "Actualizar Tarea" : "Crear Tarea"}
            type="submit"
          />
          {currentTask && (
            <BotonPrimario
              texto="Cancelar"
              onClick={onCancel}
              className="bg-gray-500 hover:bg-gray-700"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
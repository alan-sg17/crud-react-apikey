import React, { useEffect, useState } from "react";
import taskService from "../services/taskService";
import BotonPrimario from "./BotonPrimario";
import Swal from "sweetalert2";

const TaskList = ({ onEditTask, onTaskCreatedOrUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError("Error al cargar las tareas. Inténtalo de nuevo más tarde.");
      console.error("Failed to fetch tasks:", err);
      Swal.fire(
        "Error",
        "No se pudieron cargar las tareas. Verifica que el backend esté funcionando.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [onTaskCreatedOrUpdated]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡eliminarla!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await taskService.deleteTask(id);
          Swal.fire("¡Eliminada!", "La tarea ha sido eliminada.", "success");
          fetchTasks();
        } catch (err) {
          console.error("Error deleting task:", err);
          Swal.fire("Error", err.message || "No se pudo eliminar la tarea.", "error");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p className="text-gray-600">Cargando tareas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (tasks.length === 0) return <p className="text-gray-600">No hay tareas registradas.</p>;

  return (
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lista de Tareas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                Título
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                Fecha Límite
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.title}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {task.description}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status === 'pending' && 'Pendiente'}
                    {task.status === 'in_progress' && 'En progreso'}
                    {task.status === 'completed' && 'Completada'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <BotonPrimario
                    texto="Editar"
                    onClick={() => onEditTask(task)}
                  />
                  <BotonPrimario
                    texto="Eliminar"
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 hover:bg-red-700"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
import React, { useState, useEffect } from "react";
import BotonPrimario from "./BotonPrimario";
import Swal from "sweetalert2";
import { callIA } from "../service/openai";


const TaskForm = ({ currentTask, onSave, onCancel }) => {
  const obtenerTareas = () => {
    const tareasGuardadas = localStorage.getItem("task");
    if (tareasGuardadas) {
      let parsed = JSON.parse(tareasGuardadas);
      return Array.isArray(parsed) ? parsed : [];
    } else {
      return [];
    }
  };

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    category: ""
  });
  const [lista, setLista] = useState(obtenerTareas);

  useEffect(() => {
    localStorage.setItem("task", JSON.stringify(lista));
  }, [lista]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleEdit = (id) => {
    const tareaEditar = lista.find((t) => t.id === id);
    if (tareaEditar) setTask(tareaEditar);
  };

  // === IA helpers ===
  const obtenerInsights = async () => {
    if (lista.length === 0) {
      Swal.fire("Sin datos", "Agrega tareas primero.", "info");
      return;
    }
    const texto = lista.map(t => `${t.title} [${t.status}]`).join(", ");
    const prompt = `Analiza estas tareas y dame un consejo motivacional de una sola frase: ${texto}`;
    const consejo = await callIA(prompt);
    Swal.fire("Insight de productividad", consejo, "info");
  };

  const clasificarTarea = async (titulo) => {
    const prompt = `Clasifica esta tarea en: Trabajo, Personal o Estudio: "${titulo}"`;
    return await callIA(prompt);
  };

  const estimarTiempo = async (titulo) => {
    const prompt = `¿Cuánto tiempo suele llevar "${titulo}"? Responde con una frase breve.`;
    const tiempo = await callIA(prompt);
    Swal.fire("Estimación de tiempo", tiempo, "info");
  };
  // ===================

  const botonguardar = async (e) => {
    e.preventDefault();
    if (!task.title || !task.status) {
      Swal.fire("Error", "El título y el estado son obligatorios.", "error");
      return;
    }

    let nuevaCategoria = task.category;
    if (!nuevaCategoria) {
      nuevaCategoria = await clasificarTarea(task.title);
    }

    if (task.id) {
      const listaActualizada = lista.map((t) =>
        t.id === task.id ? { ...task, category: nuevaCategoria } : t
      );
      setLista(listaActualizada);
      Swal.fire("¡Actualizada!", "Tarea actualizada exitosamente.", "success");
    } else {
      const nuevaTarea = { ...task, id: Date.now(), category: nuevaCategoria };
      const nuevaLista = [...lista, nuevaTarea];
      setLista(nuevaLista);
      Swal.fire("¡Creada!", "Tarea creada exitosamente.", "success");
    }

    setTask({ title: "", description: "", status: "pending", due_date: "", category: "" });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const nueva = lista.filter((t) => t.id !== id);
        setLista(nueva);
        Swal.fire("Eliminada", "La tarea ha sido eliminada.", "success");
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center mb-4">
        <BotonPrimario texto="Obtener Insights" onClick={obtenerInsights} />
      </div>

      {/* Formulario */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {task.id ? "Editar Tarea" : "Crear Nueva Tarea"}
        </h2>
        <form onSubmit={botonguardar} className="space-y-4">
          <div>
            <label className="block">Título:</label>
            <input type="text" name="title" value={task.title} onChange={handleChange} className="border rounded w-full p-2" required />
          </div>
          <div>
            <label className="block">Descripción:</label>
            <textarea name="description" value={task.description} onChange={handleChange} className="border rounded w-full p-2 h-24" />
          </div>
          <div>
            <label className="block">Estado:</label>
            <select name="status" value={task.status} onChange={handleChange} className="border rounded w-full p-2" required>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>
          <div>
            <label className="block">Fecha límite:</label>
            <input type="date" name="due_date" value={task.due_date} onChange={handleChange} className="border rounded w-full p-2" />
          </div>
          <div>
            <label className="block">Categoría (opcional):</label>
            <input type="text" name="category" value={task.category} onChange={handleChange} className="border rounded w-full p-2" />
          </div>
          <div className="flex justify-end space-x-4">
            <BotonPrimario texto={task.id ? "Actualizar Tarea" : "Crear Tarea"} type="submit" />
            {task.id && (
              <BotonPrimario texto="Cancelar" onClick={() => setTask({ title: "", description: "", status: "pending", due_date: "", category: "" })} className="bg-gray-500 hover:bg-gray-700" />
            )}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Lista de Tareas</h2>
        {lista.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No hay tareas registradas.</p>
        ) : (
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Título</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-2">{t.title}</td>
                  <td className="px-4 py-2">{t.description}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${getStatusColor(t.status)}`}>
                      {t.status === "pending" && "Pendiente"}
                      {t.status === "in_progress" && "En progreso"}
                      {t.status === "completed" && "Completada"}
                    </span>
                  </td>
                  <td className="px-4 py-2">{t.category || "-"}</td>
                  <td className="px-4 py-2">{t.due_date ? new Date(t.due_date).toLocaleDateString() : "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <BotonPrimario texto="Editar" onClick={() => handleEdit(t.id)} />
                    <BotonPrimario texto="Eliminar" onClick={() => handleDelete(t.id)} className="bg-red-500 hover:bg-red-700" />
                    <BotonPrimario texto="Estimar Tiempo" onClick={() => estimarTiempo(t.title)} className="bg-purple-500 hover:bg-purple-700" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskForm;

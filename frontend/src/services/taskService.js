import axios from 'axios';

const API_URL = "http://localhost:3000/tasks";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

const taskService = {
    getTasks: async () => {
        try {
            const response = await apiClient.get('/');
            return response.data;
        } catch (error) {
            console.error("Error fetching tasks: ", error);
            throw error.response?.data?.message || error.message || "Error desconocido al obtener tareas";
        }
    },

    getTaskById: async (id) => {
        try {
            const response = await apiClient.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching task: ", error);
            throw error.response?.data?.message || error.message || "Error desconocido al obtener la tarea";
        }
    },

    createTask: async (taskData) => {
        try {
            const response = await apiClient.post('/', taskData);
            return response.data;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error.response?.data?.message || error.message || "Error desconocido al crear tarea";
        }
    },

    updateTask: async (id, taskData) => {
        try {
            const response = await apiClient.put(`/${id}`, taskData);
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error.response?.data?.message || error.message || "Error desconocido al actualizar tarea";
        }
    },

    deleteTask: async (id) => {
        try {
            await apiClient.delete(`/${id}`);
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error.response?.data?.message || error.message || "Error desconocido al eliminar tarea";
        }
    },
};

export default taskService;
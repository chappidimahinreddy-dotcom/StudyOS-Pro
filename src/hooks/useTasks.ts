import { useState } from "react";
import { Task } from "../types";

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (task: Task) => {
        setTasks((prev) => [task, ...prev]);
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const toggleTask = (id: string) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    return {
        tasks,
        setTasks,
        addTask,
        deleteTask,
        toggleTask,
    };
}
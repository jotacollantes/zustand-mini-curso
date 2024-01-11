import { StateCreator, create } from "zustand";
import { v4 as uuidv4 } from "uuid";

import { devtools, persist } from "zustand/middleware";
// import { produce } from 'immer';

import type { Task, TaskStatus } from "../../interfaces";
import { immer } from "zustand/middleware/immer";

interface TaskState {
  //Esta propiedad es para saber que task se esta moviendo
  draggingTaskId?: string;
  // tasks: { [key: string]: Task }, se puede usar lo siguiente donde Record especifica que la llave es de tipo string y su valor es de tipo Task interface
  tasks: Record<string, Task>;
  getTaskByStatus: (status: TaskStatus) => Task[];
  addTask: (title: string, status: TaskStatus) => void;
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
}
//? Hay que especificar la interfaz de immer: [["zustand/immer", never]] 
const storeApi: StateCreator<TaskState, [["zustand/immer", never]]> = (
  set,
  get
) => ({
  draggingTaskId: undefined,
  tasks: {
    "ABC-1": { id: "ABC-1", title: "Task 1", status: "open" },
    "ABC-2": { id: "ABC-2", title: "Task 2", status: "in-progress" },
    "ABC-3": { id: "ABC-3", title: "Task 3", status: "open" },
    "ABC-4": { id: "ABC-4", title: "Task 4", status: "open" },
  },

  getTaskByStatus: (status: TaskStatus) => {
    //leemos el state con get()
    const tasks = get().tasks;
    console.log(Object.values(tasks));
    //! No se puede usar for/forof/foreach porque tasks no es un array
    //! Object.values() devuelve un array de tareas :
    /*
    [
      { id: 'ABC-1', title: 'Task 1', status: 'open' },
      { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
      { id: 'ABC-3', title: 'Task 3', status: 'open' },
      { id: 'ABC-4', title: 'Task 4', status: 'open' }
    ]
    */
    return Object.values(tasks).filter((task) => task.status === status);
  },

  addTask: (title: string, status: TaskStatus) => {
    const newTask = { id: uuidv4(), title, status };
    //? Con el middleware de immer
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    //? Requiere npm install immer. Con produce() solo usamos una linea donde creamos la nueva tarea
    // set( produce( (state: TaskState) => {
    //   state.tasks[newTask.id] = newTask;
    // }))

    //? Forma nativa de Zustand la que todo el mundo esta acostubrado hacerlo en reducer o redux
    // set( state => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask
    //   }
    // }))
  },

  setDraggingTaskId: (taskId: string) => {
    set(()=>({ draggingTaskId: taskId }));
  },

  removeDraggingTaskId: () => {
    set(()=>({ draggingTaskId: undefined }));
  },

  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    const task = { ...get().tasks[taskId] };
    task.status = status;
    //? con immer middleware
    set((state) => {
      state.tasks[taskId] = {
        ...task,
        // ...state.tasks[taskId],
        // status,
      };
    });

    // set( (state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task,
    //   }
    // }))
  },

  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;

    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },
});

export const useTaskStore = create<TaskState>()(
  devtools(persist(immer(storeApi), { name: "task-store" }))
);

// task-store

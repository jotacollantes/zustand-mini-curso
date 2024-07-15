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
  //Metodo que va a establecer en la propiedad draggingTaskId el valor del id de la task o undefined
  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
}
//? Hay que especificar la interfaz de immer: [["zustand/immer", never]]
const storeApi: StateCreator<
  TaskState,
  [["zustand/devtools", never], ["zustand/immer", never]]
> = (set, get) => ({
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
    //console.log({ tasks });
    /**
    {
      4a3e1b7c-c772-4930-912c-aea4df563b1a: {id: '4a3e1b7c-c772-4930-912c-aea4df563b1a', title: 'tarea 4', status: 'done'}
      ABC-1: {id: 'ABC-1', title: 'Task 1', status: 'open'}
      ABC-2: {id: 'ABC-2', title: 'Task 2', status: 'done'}
      ABC-3: : {id: 'ABC-3', title: 'Task 3', status: 'open'}
  }
   */

    //!Crea un array con los nombres de  las propiedades
    //console.log(Object.keys(tasks));
    /**
    [
    "ABC-1",
    "ABC-2",
    "ABC-3",
    "ABC-4",
    "4a3e1b7c-c772-4930-912c-aea4df563b1a"
    ]
    */

    //!Crea un array con los valores del objeto
    //console.log(Object.values(tasks));
    //! No se puede usar for/forof/foreach porque tasks no es un array
    //! Object.values() devuelve un array de objetos task :
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
    //!Creo una nueva tarea
    const newTask = { id: uuidv4(), title, status };
    //? Con el middleware de immer
    //!Mutamos el estado agregando la nueva tarea, el middleware de immer se encargara de mantener los valores actuales del state y no es necesario hacer el spread... de state.task
    //? No retormanos valor porque el callback dentro de set() es una funcion con cuerpo que ejecuta una linea.
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    //? Requiere npm install immer. Con produce() solo usamos una linea donde creamos la nueva tarea y mutamos el state modificando sus datos. No retormanos valor porque el callback dentro de produce() es una funcion con cuerpo que ejecuta una linea.
    // set( produce( (state: TaskState) => {
    //   state.tasks[newTask.id] = newTask;
    // }))

    //? Forma nativa de Zustand la que todo el mundo esta acostubrado hacerlo en reducer o redux que es retornando un nuevo state haciendo spread del actual y agregar una nueva task
    // set( state => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask
    //   }
    // }))
  },

  setDraggingTaskId: (taskId: string) => {
    console.log(`start dragin ${taskId}`)
    set(() => ({ draggingTaskId: taskId }));
  },

  removeDraggingTaskId: () => {
    
    set((state) => {
      console.log(`removido ${state.draggingTaskId}`)
      return { draggingTaskId: undefined }
    });
  },

  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    //!Propagamos todas las propiedades de la task cuyo taskId coincida con el name/id de la key  de la propiedad
    
    const task = { ...get().tasks[taskId] };
    //console.log(task)
    //!sobreescribimos la propiedad status
    task.status = status;
    //console.log(task)
    //? Con immer middleware. No retormanos valor porque el callback dentro de set() es una funcion con cuerpo que ejecuta una linea.
    set((state) => {
      //!Sobreescribimos(Mutacion) el objeto cuyo key concida con taskId
      state.tasks[taskId] = {
        //!Propagamos las propiedades del objeto task
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

import { DragEvent, useState } from 'react';
import Swal from 'sweetalert2';

import { useTaskStore } from '../stores';
import { TaskStatus } from '../interfaces';


interface Options {
  status: TaskStatus;
 
}

export const useTasks = ({ status }: Options) => {

  const isDragging = useTaskStore( state => !!state.draggingTaskId );
  const taskId = useTaskStore( state => state.draggingTaskId );
  const onTaskDrop = useTaskStore( state => state.onTaskDrop );
  const addTask = useTaskStore( state => state.addTask );

  const [ onDragOver, setOnDragOver ] = useState( false );

  const handleAddTask = async () => {

    const { isConfirmed, value } = await Swal.fire( {
      title: 'Nueva tarea',
      input: 'text',
      inputLabel: 'Nombre de la tarea',
      inputPlaceholder: 'Ingrese el nombre de la tarea',
      showCancelButton: true,
      //inputValidator:result => !result && 'You need to select something!'
      inputValidator: ( value ) => {
        if ( !value ) {
          return 'Debe de ingresar un nombre para la tarea';
        }
      }
      
    } );

    if ( !isConfirmed ) return;
    //!El status es dependiendo de la columna o tipo de lista de tareas donde haya seleccionado la opcion de anadir tarea puede ser  "open" | "in-progress" | "done". value es el nombre de la tarea proporcionada por sweetalert y status es lo que se recibe como props en este custom hook

    addTask( value, status );
  };


  const handleDragOver = ( event: DragEvent<HTMLDivElement> ) => {
    event.preventDefault();
    console.log(`start drag over ${taskId} ${status} `)
    setOnDragOver( true );
  };

  const handleDragLeave = ( event: DragEvent<HTMLDivElement> ) => {
    event.preventDefault();
    console.log(`leave drag  ${taskId} ${status}`)
    setOnDragOver( false );
  };

  const handleDrop = ( event: DragEvent<HTMLDivElement> ) => {
    event.preventDefault();
    setOnDragOver( false );
    onTaskDrop( status );
    console.log(`drop drag  ${taskId} ${status}`)
  };

  return {
    // Properties
    isDragging,

    //State
    onDragOver,
    // Methods
    handleAddTask,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
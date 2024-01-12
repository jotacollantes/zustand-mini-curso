import { StateCreator } from "zustand";

export interface DateSlice {
  eventDate: Date; // number, string, primitivo

  //getters
  eventYYYYMMDD: () => string;
  eventHHMM: () => string;

  setEventDate: (parcialDate: string) => void;
  setEventTime: (eventTime: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
  eventDate: new Date(),

  eventYYYYMMDD: () => {
    //console.log(get().eventDate.toISOString());
    //date.slice.ts:24 2024-01-12T14:58:10.464Z
    //console.log(get().eventDate.toISOString().split("T")[0]);
    //2024-01-12
    return get().eventDate.toISOString().split("T")[0];
  },

  eventHHMM: () => {
    //!Con padStart llenamos de 0 al inicio
    const hours = get().eventDate.getHours().toString().padStart(2, "0");
    const minutes = get().eventDate.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  },

  setEventDate: (parcialDate: string) =>
    set((state) => {
      //!De formato string creamos una instancia del objeto Date()
      const date = new Date(parcialDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      //! gateDate esta en base 0 hay que sumarle 1
      const day = date.getDate()+1;
      console.log({ year, month, day });
      //Creamos un nuevo objeto basado en la fecha anterior o la que actualmente se encuentra en el estado
      const newDate = new Date(state.eventDate);
      newDate.setFullYear(year, month, day);
      console.log({ newDate });
      return { eventDate: newDate };
    }),

  //!Tambien se puede hacer de esta manera
  setEventTime: (eventTime: string) => {
    set((state) => {
      //HH:MM

      const hours = parseInt(eventTime.split(":")[0]);
      const minutes = parseInt(eventTime.split(":")[1]);
      //!Creamos un nuevo objeto basado en la fecha anterior o la que actualmente se encuentra en el estado para configurarles la fecha seleccionada por el usuario
      console.log({hours,minutes})
      const newDate = new Date(state.eventDate);
      newDate.setHours(hours, minutes);
      console.log(newDate)
      return { eventDate: newDate };
    });
  },
});

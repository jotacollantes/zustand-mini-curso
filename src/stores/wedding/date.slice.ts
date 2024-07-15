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
      //console.log({parcialDate})
      //parcialDate: "2024-07-20
      const date = new Date(parcialDate);
      //en el console se pinta pero con un dia menos pero el objeto si tiene la fecha correcta : {"date": "2024-07-20T00:00:00.000Z"}
      //console.log({date})

      //"2024-07-20T00:00:00.000Z"
      const year = date.getFullYear();
      const month = date.getMonth();
      //! gateDate esta en base 0 hay que sumarle 1
      const day = date.getDate()+1;
      //console.log({ year, month, day });
      
      //console.log(state.eventDate)
      //!Creamos un nuevo objeto basado en la fecha anterior o la que actualmente se encuentra en el estado
      const newDate = new Date(state.eventDate);
      //const newDate = new Date();
      //console.log({newDate})
      newDate.setFullYear(year, month, day);
      //Con la fecha ya modificada
      console.log({ newDate });
      return { eventDate: newDate };
    }),

  //!Tambien se puede hacer de esta manera
  setEventTime: (eventTime: string) => {
    set((state) => {
      //HH:MM

      const hours = parseInt(eventTime.split(":")[0]);
      const minutes = parseInt(eventTime.split(":")[1]);
      //!Creamos un nuevo objeto basado en la fecha anterior o la que actualmente se encuentra en el estado para configurarles la fecha seleccionada por el usuario caso contrario si no se crea el objeto basado en la fecha del state la hora se cambiara en la fecha que especifica la nueva instancia de Date que si no se envia el state la hora se cambiaria al dia actual.
      console.log({hours,minutes})
      const newDate = new Date(state.eventDate);
      newDate.setHours(hours, minutes);
      console.log(newDate)
      return { eventDate: newDate };
    });
  },
});

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { PersonSlice, createPersonSlice } from "./person.slice";
import { GuestSlice, createGuestSlice } from "./guest.slice";
import { DateSlice, createDateSlice } from "./date.slice";
import {ConfirmationSlice,createConfirmationSlice,} from "./confirmation.slice";

// Crear el store
//!ShareState es la union de  todas las interfaces que definen a cada uno de los slices
type ShareState = PersonSlice & GuestSlice & DateSlice & ConfirmationSlice;


export const useWeddingBoundStore = create<ShareState>()(
  // persist(
  devtools(
    //! con el spread  ...a significa (set,get, storeApi)
    (...a) => {
      return {
        //! Propago las propiedades de cada uno de los slices
        ...createPersonSlice(...a),
        ...createGuestSlice(...a),
        ...createDateSlice(...a),
        ...createConfirmationSlice(...a),
      };
    }
    // ), { name: 'wedding-store' }
  )
);

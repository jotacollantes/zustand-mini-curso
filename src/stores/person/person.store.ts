import { type StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customSessionStorage } from '../storages/session.storage';
//import { firebaseStorage } from '../storages/firebase.storage';
//import { logger } from '../middlewares/logger.middleware';



interface PersonState {
  firstName: string;
  lastName: string;
}

interface Actions {
  setFirstName: ( value: string ) => void;
  setLastName: ( value: string ) => void;
}

//! separamos la logica del manejo del state creamos dentro del objeto storeAPi. para poder mostrar el nombre de la accion que se esta ejecutando en redux dev tool tenemos que anadir los argumentos false que serivira para mantener el estado (Ex. para poder seguir escribiendo en en un input) y no reemplazarlo,  y el 'nombre-de-la-accion' al metodo set. Tambien es necesario inluir la interfaz [ [ "zustand/devtools", never ] ] al type StateCreator.
//! devtools() expande la funcionalidad de los metodos que cambia el estado en el store
const storeAPi: StateCreator<PersonState & Actions, [ [ "zustand/devtools", never ] ]> = ( set ) => ( {

  firstName: '',
  lastName: '',

  setFirstName: ( value: string ) => set( ( { firstName: value } ), false, 'setFirstName' ),
  setLastName: ( value: string ) => set( ( { lastName: value } ), false, 'setLastName' ),

} );




//! Envolvemos todo en el middleware devtools() para poder usar las redux dev tools
export const usePersonStore = create<PersonState & Actions>()(
  devtools(
    persist(
      storeAPi
      , {
        name: 'person-storage',
        //!por defecto se crea en el localstorage
        //! Cuando se usa SessionStorage hay que hacer la propia implentacion con createJSONStorage()
         storage: customSessionStorage,
        //storage: firebaseStorage,
      } )
  )
);


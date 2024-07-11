import { StateStorage, createJSONStorage } from 'zustand/middleware';


//!StateStorage implementa las propiedades getItem(), setItem(),removeItem()
const storageApi: StateStorage =  {

  getItem: function ( name: string ): string | Promise<string | null> | null {
    //!sessionStorage es propio del navegador.
    const data = sessionStorage.getItem(name);
    return data;

  },

  setItem: function ( name: string, value: string ): void {
    sessionStorage.setItem(name, value);
  },

  removeItem: function ( name: string ): void | Promise<void> {
    console.log('removeItem', name);
  }
}

//!Exportamos customSessionStorage para que se use en la propiedad storage del middleware persist. customSessionStorage ya seria reutilizable
export const customSessionStorage = createJSONStorage( () => storageApi  );
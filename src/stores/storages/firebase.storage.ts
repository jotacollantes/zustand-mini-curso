import { StateStorage, createJSONStorage } from 'zustand/middleware';

const firebaseUrl = 'https://zustand-cf6eb-default-rtdb.firebaseio.com/zustand';

const storageApi: StateStorage =  {

  getItem: async function ( name: string ): Promise<string | null> {
    
    try {
       //! name: "person-storage",
      const data = await fetch(`${ firebaseUrl }/${ name }.json`).then( res => res.json());
      //Firebase lo devuelve como un objeto y para incorporarlo al state de zustand hay que serializarlo
      return JSON.stringify( data );

    } catch (error) {
      //throw error;
      return null
    }

  },

  setItem: async function ( name: string, value: string ): Promise<void> {
    await fetch(`${ firebaseUrl }/${ name }.json`, {
      method: 'PUT',
      body: value //{ firstName: '',lastName:''}
    }).then( res => res.json());

    // console.count('setItem');

    return;
  },

  removeItem: function ( name: string ): void | Promise<void> {
    console.log('removeItem', name);
  }
}


export const firebaseStorage = createJSONStorage( () => storageApi  );
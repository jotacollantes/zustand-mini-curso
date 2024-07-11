import { create } from 'zustand'

interface Bear {
  id: number;
  name: string;
}


interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];
  
  //! Opcion 1 como un metodo normal
  //totalBears: () => number;
  

  //! Opcion 2esta propiedad servirar para anadir objetos con propiedades cuyos valores seran computados con un getter de javascript
  computed: {
    totalBears: number;
  },

  increaseBlackBears: (by: number) => void;
  increasePolarBears: (by: number) => void;
  increasePandaBears: (by: number) => void;


  doNothing: () => void;
  addBear:   () => void;
  clearBears: () => void;


}



export const useBearStore = create<BearState>()((set, get) => ({
  blackBears: 10,
  polarBears: 5,
  pandaBears: 1,


  bears: [ { id: 1, name: 'Oso #1' }  ],

   //! Opcion 1 como un metodo normal
  //  totalBears: () => {
  //   return get().blackBears + get().polarBears + get().pandaBears + get().bears.length;
  // },
  computed: {
    //!Usamos el metodo get de los objetos de javascript
    get totalBears() {
      //!  con get() que es un metodo de zustand obtenemos los valores del state no confundir con el metodo get() de los objetos de javascript
      return get().blackBears + get().polarBears + get().pandaBears + get().bears.length;
    }
  },



  increaseBlackBears: (by: number) => set((state) => ({ blackBears: state.blackBears + by })),
  increasePolarBears: (by: number) => set((state) => ({ polarBears: state.polarBears + by })),
  increasePandaBears: (by: number) => set((state) => ({ pandaBears: state.pandaBears + by })),
  
  //! Con ...state.bears creamos un nuevo arreglo con los mismos valores del state actual doNothing actualizara el estado con sus mismos datos
  doNothing: () => set(state => ({ bears: [...state.bears] })),
  addBear: () => set(state => ({ 
    //!agregamos un nuevo objeto de oso al array bears
    bears: [...state.bears, { id: state.bears.length + 1, name: `Oso #${ state.bears.length + 1 }` }] 
  })),
  clearBears: () => set({ bears: [] })

}));
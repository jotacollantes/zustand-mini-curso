import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Bear {
  id: number;
  name: string;
}


interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];

  //! esta propiedad servirar para anadir objetos con propiedades cuyos valores seran computados con un getter de javascript. Si ya se usa el persist el get de javascript ya no va a funcionar y habria que modificar la propiedad para que sea un metodo que retorna un number
  //  computed: {
  //    totalBears: number;
  //  },
  totalBears: () => number;

  increaseBlackBears: ( by: number ) => void;
  increasePolarBears: ( by: number ) => void;
  increasePandaBears: ( by: number ) => void;


  doNothing: () => void;
  addBear: () => void;
  clearBears: () => void;


}



export const useBearStore = create<BearState>()(
  devtools(persist(

    ( set, get ) => ( {
      blackBears: 10,
      polarBears: 5,
      pandaBears: 1,


      bears: [ { id: 1, name: 'Oso #1' } ],


      // computed: {
      //   //!Usamos el metodo get de los objetos de javascript
      //   get totalBears() {
      //     //!  con get() que es un metodo de zustand obtenemos los valores del state no confundir con el metodo get() de los objetos de javascript
      //     return get().blackBears + get().polarBears + get().pandaBears + get().bears.length;
      //   }
      // },
    
      totalBears: () => {
        return get().blackBears + get().polarBears + get().pandaBears + get().bears.length;
      },



      increaseBlackBears: ( by: number ) => set( ( state ) => ( { blackBears: state.blackBears + by } ),false,'increaseBlackBears' ),
      increasePolarBears: ( by: number ) => set( ( state ) => ( { polarBears: state.polarBears + by } ),false,'increasePolarBears' ),
      increasePandaBears: ( by: number ) => set( ( state ) => ( { pandaBears: state.pandaBears + by } ),false,'increasePandaBears' ),


      doNothing: () => set( state => ( { bears: [ ...state.bears ] } ),false,'doNothing' ),
      addBear: () => set( state => ( {
        bears: [ ...state.bears, { id: state.bears.length + 1, name: `Oso #${ state.bears.length + 1 }` } ]
      } ),false,'addBear' ),
      clearBears: () => set( { bears: [] },false,'clearBears' )

    } ),
    { name: 'bears-store' }
  ))

);
import axios from 'axios';
import { useAuthStore } from '../stores';




const tesloApi = axios.create({
  baseURL: 'http://localhost:3000/api'
});

//! CUalquier conexion http que use axios que se dirija al backend va a usar el interceptor que en este caso servira para verificar el token 
// Todo: interceptors
// Leer el store de Zustand
tesloApi.interceptors.request.use(
  (config) => {

    //!Cuando se usa Zustan para leer el store fuera de react se lo tiene que hacer de la manera .getState() y no a la manera de hook  const store = useZustandStore( state => state.fields );
    const token = useAuthStore.getState().token;
    // console.log({token});

    if ( token ) {
      //!Modificamos el header
      config.headers['Authorization'] = `Bearer ${ token }`;
    }

    return config;
  }
)



export {
  tesloApi
}

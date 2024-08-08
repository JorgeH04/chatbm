// reducers/usuarioReducer.js

import { LOAD_USUARIO_REQUEST, LOAD_USUARIO_SUCCESS, LOAD_USUARIO_FAILURE } from '../actions/usuarioActions';

const initialState = {
  usuario: null,
  cargandoUsuario: true,
  error: null
};

const usuarioReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USUARIO_REQUEST:
      return {
        ...state,
        cargandoUsuario: true,
        error: null
      };
    case LOAD_USUARIO_SUCCESS:
      return {
        ...state,
        usuario: action.payload,
        cargandoUsuario: false,
        error: null
      };
    case LOAD_USUARIO_FAILURE:
      return {
        ...state,
        cargandoUsuario: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default usuarioReducer;
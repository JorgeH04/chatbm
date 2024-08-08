
import Axios from 'axios';

export const LOAD_USUARIO_REQUEST = 'LOAD_USUARIO_REQUEST';
export const LOAD_USUARIO_SUCCESS = 'LOAD_USUARIO_SUCCESS';
export const LOAD_USUARIO_FAILURE = 'LOAD_USUARIO_FAILURE';

export const loadUsuarioRequest = () => ({
  type: LOAD_USUARIO_REQUEST
});

export const loadUsuarioSuccess = usuario => ({
  type: LOAD_USUARIO_SUCCESS,
  payload: usuario
});

export const loadUsuarioFailure = error => ({
  type: LOAD_USUARIO_FAILURE,
  payload: error
});

export const loadUsuario = () => {
  return async dispatch => {
    dispatch(loadUsuarioRequest());
    try {
      const { data: usuario } = await Axios.get('/api/usuarios/whoami');
      dispatch(loadUsuarioSuccess(usuario));
    } catch (error) {
      dispatch(loadUsuarioFailure(error.message));
    }
  };
};
import { API }          from '../utils/api';
import { Config }       from '../../config';
import { checkVersion } from './utils';

export const SET_DEX_TYPES = 'SET_DEX_TYPES';

export function listDexTypes () {
  return (dispatch) => {
    dispatch(checkVersion());

    return API.get(`${Config.API_HOST}/dex-types`)
      .then((dexTypes) => {
        dispatch(setDexTypes(dexTypes));
        return dexTypes;
      });
  };
}

export function setDexTypes (dexTypes) {
  return { type: SET_DEX_TYPES, dexTypes };
}

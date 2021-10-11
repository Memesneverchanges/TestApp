import { sendRequest } from './utils.js';
import states from './states.json';

export const FETCH_PENDING = 'FETCH_PENDING';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';
export const SAVING_PENDING = 'SAVING_PENDING';
export const SAVING_SUCCESS = 'SAVING_SUCCESS';
export const SAVING_ERROR = 'SAVING_ERROR';
export const SAVING_CANCEL = 'SAVING_CANCEL';
export const SET_CHANGES = 'SET_CHANGES';
export const SET_EDIT_ROW_KEY = 'SET_EDIT_ROW_KEY';

const URL = states.URL
const tnames=states.tnames
let currentdb=""
export async function loadOrders(dispatch,change) {
  dispatch({ type: FETCH_PENDING });
console.log(change)
  try {
    currentdb=change
    const  data  = await sendRequest(`${URL}/Selectall/${change}`);
    const tablenames = JSON.stringify(tnames.slice(0, 4))
    const lookupdata  = await sendRequest(`${URL}/Selectallnames`,'PUT',{tablenames: tablenames});
    dispatch({
      type: FETCH_SUCCESS,
      payload: {
        data: data,
        currentdb: indicatetable(change),
        lookupdata: lookupdata
      }
    });
  } catch(err) {
    dispatch({ type: FETCH_ERROR });
    throw err;
  }
}

export async function saveChange(dispatch, change) {
  if (change && change.type) {
    let data;

    dispatch({ type: SAVING_PENDING });

    try {
      data = await sendChange(URL, change);
      change.data = data;
      dispatch({
        type: SAVING_SUCCESS,
        payload: {
          change: change
        }
      });

      return data;
    } catch(err) {
      console.log(err)
      dispatch({ type: SAVING_ERROR });
      throw err;
    }
  } else {
    dispatch({ type: SAVING_CANCEL });
  }
}

async function sendChange(url, change) {
  console.log("CHANGE IN SENDCHANGE:",change)
  console.log("HOPE FOR THIS",currentdb)
  switch (change.type) {
    case 'insert':
      return sendRequest(`${url}/Insert/${currentdb}`, 'POST', {
        values: JSON.stringify(change.data)
      });
    case 'update':
      return sendRequest(`${url}/Update/${currentdb}`, 'PUT', {
        key: change.key,
        values: JSON.stringify(change.data)
      });
    case 'remove':
      return sendRequest(`${url}/Delete/${currentdb}`, 'DELETE', { key: change.key });
    default:
      break;
  }
}
function indicatetable(change) {
  switch (change) {
    case tnames[0]: return ({ Eq_model: true, parameter: false, process: false, target_type: false, target_trans: false })
    case tnames[1]: return ({ Eq_model: false, parameter: true, process: false, target_type: false, target_trans: false })
    case tnames[2]: return ({ Eq_model: false, parameter: false, process: true, target_type: false, target_trans: false })
    case tnames[3]: return ({ Eq_model: false, parameter: false, process: false, target_type: true, target_trans: false })
    case tnames[4]: return ({ Eq_model: false, parameter: false, process: false, target_type: false, target_trans: true })
    default: return ({ Eq_model: false, parameter: false, process: false, target_type: false, target_trans: false })
  }
}
export function setChanges(dispatch, changes) {
  dispatch({
    type: SET_CHANGES,
    payload: changes
  });
}

export function setEditRowKey(dispatch, editRowKey) {
  dispatch({
    type: SET_EDIT_ROW_KEY,
    payload: editRowKey
  });
}

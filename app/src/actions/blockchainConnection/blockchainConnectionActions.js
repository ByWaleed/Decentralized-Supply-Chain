import { SETUP_CONNECTION, ADD_TRANSACTION } from "./types";

export const setupConnection = (connectionDetails) => (dispatch) => {
    dispatch({
        type: SETUP_CONNECTION,
        payload: connectionDetails
    })
}

export const addTransaction = (transaction) => (dispatch) => {
    dispatch({
        type: ADD_TRANSACTION,
        payload: transaction
    })
}

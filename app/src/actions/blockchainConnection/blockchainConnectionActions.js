import { SETUP_CONNECTION } from "./types";

export const setupConnection = (connectionDetails) => (dispatch) => {
    dispatch({
        type: SETUP_CONNECTION,
        payload: connectionDetails
    })
}

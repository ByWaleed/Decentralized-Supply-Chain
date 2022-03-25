import { SETUP_CONNECTION, ADD_TRANSACTION } from "../../actions/blockchainConnection/types";

const initialState = {
    contract: null,
    account: null,
    balance: null,
    transactions: []
};

export default function blockchainReducer(state = initialState, action) {
    switch (action.type) {
        case SETUP_CONNECTION:
            return {
                ...state,
                ...action.payload
            }
        case ADD_TRANSACTION:
            return {
                ...state,
                transactions: [
                    ...state.transactions,
                    action.payload
                ]
            }
        default:
            return state;
    }
}

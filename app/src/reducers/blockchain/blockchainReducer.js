import { SETUP_CONNECTION } from "../../actions/blockchainConnection/types";

const initialState = {
    contract: null,
    account: null,
    balance: null,
    transactions: []
};

export default function blockchainReducer (state = initialState, action) {
    switch (action.type) {
        case SETUP_CONNECTION:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

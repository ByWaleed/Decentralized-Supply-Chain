import { SETUP_CONNECTION } from "../../actions/blockchainConnection/types";

const initialState = {
    provider: null,
    web3: null,
    account: null,
    contract: null,
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

import { combineReducers } from "redux";
import blockchainReducer from "./blockchain/blockchainReducer";

const rootReducer =  combineReducers ({
    blockchain: blockchainReducer
});

export default rootReducer;

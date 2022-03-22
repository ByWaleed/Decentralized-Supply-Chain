const initialState = {
    provider: "some-provider",
    web3: null,
    account: null,
    contract: null,
};

export default function blockchainReducer (state = initialState, action) {
    switch (action.type) {
        case "value":

            break;

        default:
            return state;
    }
}

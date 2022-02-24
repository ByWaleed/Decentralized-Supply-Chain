App = {
    init: async function () {
        return await App.initWeb3();
    },
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});

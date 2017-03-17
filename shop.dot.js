aliasAttributes.push({
    name: "dc-add-to-cart",
    alias: {
        name: "dc-click",
        value: "#cart.items.push({{{@}}})"
    }
});

scope.cart = {
    items: []
};

injectedSites.push({
    link: "cart",
    template: "<b>Cart</b><section dc-repeat='#cart.items -> item'><h1>{{item}}.dot.css</h1><code>&lt;dc-module module=\"{{item}}\"&gt;&lt;/dc-module&gt;</code></section>"
});
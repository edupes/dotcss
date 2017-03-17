const version = 1;

function ex(string) {

    /*if (string != "#") {
    	string = "#" + string;
    }*/

    if (string != null) {

        while (string.includes("#")) {
            string = string.replace("#", "scope.");
        }

        try {
            return eval(string);
        } catch (err) {
            console.warn("A error occurred: Object '" + string + "' not found!");
            return "@";
        }
    } else {
        console.warn("Executed null string");
    }
}


var aliasAttributes = [
    { name: "dc-page", alias: { name: "dc-if", value: "#state.link == '{{{@}}}'" } }
];

var injectedSites = [
    {
        link: "_info",
        template: "<b>dotcss version " + version + "</b>"
    }
];

var pageNames = [];

window.onload = function () {
    initial();
};

function addComment(comment, element) {
    var c = document.createComment(" " + comment + " ");

    element.parentNode.insertBefore(c, element);
}

function initial() {

	document.getElementsByTagName("nav")[0].innerHTML += "<a class='show' dc-click='document.getElementsByTagName(\"nav\")[0].className += \" open\"'>&#8801;</a>";

    var els = document.getElementsByTagName("dc-module");
    for (i in els) {
        if (!isNaN(i)) {
            var e = els[i];
            e.innerHTML = "<link rel='stylesheet' href='" + e.getAttribute("module") + ".dot.css' />";
            loadScript(e.getAttribute("module") + ".dot.js");
        }
    }

    for (i in injectedSites) {
        if (pageNames.indexOf(injectedSites[i].link) == -1) {
            var exists = false;

            var page = document.createElement('page');
            page.setAttribute("dc-page", injectedSites[i].link);
            page.innerHTML = injectedSites[i].template;

            document.body.appendChild(page);

            pageNames.push(injectedSites[i].link);
        }
    }

    setTimeout(function () {
        var els = document.getElementsByTagName("*");

        for (i in els) {
            if (!isNaN(i)) {
                var e = els[i];

                if (e.hasAttribute("dc-include")) {

                    var id = " inc_" + Math.floor(Math.random() * 100000);
                    e.id += id;

                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            document.getElementById(id).innerHTML = xhttp.responseText;
                            console.log(xhttp.responseText);

                            initial();
                        }
                    };
                    xhttp.open("GET", e.getAttribute("dc-include"), true);
                    xhttp.send();

                    addComment("dc-include: " + e.getAttribute("dc-include"), e);
                    e.removeAttribute("dc-include");
                }

                //if (e.hasAttribute("dc-page")) {
                //    addComment("dc-page: " + e.getAttribute("dc-page"), e);
                //    e.setAttribute("dc-if", "#state.link == '" + e.getAttribute("dc-page") + "'");
                //}

                for (x in aliasAttributes) {
                    var alias = aliasAttributes[x];

                    if (e.hasAttribute(alias.name)) {
                        addComment(alias.name + ": " + e.getAttribute(alias.name), e);
                        var value = alias.alias.value;

                        while (value.includes("{{{@}}}")) {
                            value = value.replace("{{{@}}}", e.getAttribute(alias.name));
                        }

                        e.setAttribute(alias.alias.name, value);
                    }
                }

                if (e.hasAttribute("dc-box")) {
                    addComment("dc-box: " + e.getAttribute("dc-box"), e);
                    e.setAttribute("dc-if", "#state.box == '" + e.getAttribute("dc-box") + "'");
                }

                if (e.hasAttribute("dc-tab")) {
                    addComment("dc-tab: " + e.getAttribute("dc-tab"), e);
                    e.setAttribute("dc-if", "#state.tab == '" + e.getAttribute("dc-tab") + "'");
                }

                if (e.hasAttribute("dc-tab-set")) {
                    addComment("dc-tab-set: " + e.getAttribute("dc-tab-set"), e);
                    e.setAttribute("dc-click", "#state.tab = '" + e.getAttribute("dc-tab-set") + "'");
                }

                if (e.hasAttribute("dc-box-set")) {
                    addComment("dc-box-set: " + e.getAttribute("dc-box-set"), e);
                    e.setAttribute("dc-click", "#state.box = '" + e.getAttribute("dc-box-set") + "'");
                }

                if (e.hasAttribute("dc-if")) {
                    e.className += " dc-if";
                }

                if (e.hasAttribute("dc-link")) {
                    e.className += " dc-ref";
                }

                if (e.hasAttribute("dc-click")) {
                    e.className += " dc-click";
                }

                if (e.hasAttribute("dc-repeat")) {
                    e.className += " dc-repeat";
                    e.setAttribute("dc-repeat-template-id", rtemplates.length - 1);
                    rtemplates.push(e.innerHTML);
                }

                if (e.hasAttribute("dc-init")) {
                    ex(e.getAttribute("dc-init"));
                }
            }
        }

        els = document.getElementsByClassName("dc-ref");
        for (i in els) {
            if (!isNaN(i)) {
                var e = els[i];
                e.setAttribute("onclick", "lref(this)");
            }
        }

        els = document.getElementsByClassName("dc-click");
        for (i in els) {
            if (!isNaN(i)) {
                var e = els[i];
                e.onclick = function() {
                    ex(this.getAttribute("dc-click"));
                    update();
                }
            }
        }

        els = document.getElementsByTagName("dc-js");
        for (i in els) {
            if (!isNaN(i)) {
                var e = els[i];
                e.innerHTML = "<script src='" + e.getAttribute("src") + "'></script>";
            }
        }

        els = document.getElementsByClassName("dc-data");
        for (i in els) {
            if (!isNaN(i)) {
                var e = els[i];
                e.onkeyup = function() {
                    update()
                };
            }
        }

        update();
    }, 100);
}

var scope = {
    state: {
        link: "initial",
        box: "initial",
        tab: 0,
		nav: {
			open: false
		}
    }
};

function loadScript(url, callback)
{
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    head.appendChild(script);
}

function lref(e) {

    console.info("Opened local link: " + e);

    var path = e.getAttribute("dc-link");
    scope.state.link = path;
    window.history.pushState(scope.state, "-", "");
    document.getElementsByTagName("nav")[0].className = "";

    update();
}

var rtemplates = [];

function update() {

    console.info("Updating");

    var els = document.getElementsByClassName("dc-if");

    for (i in els) {

        if (!isNaN(i)) {

            var e = els[i];

            //alert(e.getAttribute("dc-if"));

            if (ex(e.getAttribute("dc-if"))) {
                e.style.display = "block";
            } else {
                e.style.display = "none";
            }

        }
    }

    els = document.getElementsByClassName("dc-data");
    for (i in els) {
        if (!isNaN(i)) {
            var e = els[i];
            scope[e.getAttribute("dc-data")] = e.value;
        }
    }

    els = document.getElementsByClassName("dc-repeat");
    for (i in els) {
        if (!isNaN(i)) {
            var e = els[i];
            e.style.display = "none";

            var itemsource = e.getAttribute("dc-repeat").split("->")[0];
            var itemmasked = e.getAttribute("dc-repeat").split("->")[1];

            var items = ex(itemsource);

            var elements = document.getElementsByClassName("dc-repeat-item");
            for (var y in elements) {
                if (!isNaN(y)) {
                    if (elements[y].getAttribute("dc-repeat-container-id") == e.getAttribute("dc-repeat-template-id")) {
                        //elements[y].parentNode.removeChild(elements[y]);
                        elements[y].style.display = "none";
                    }
                }
            }

            console.info(items);
            for (var z in items) {
                console.info("Repeat: " + items[z]);

                var ne = document.createElement(e.tagName);

                var index = z;
                eval(itemmasked + "=" + JSON.stringify(items[z]));

                ne.innerHTML = eval("\"" + rtemplates[e.getAttribute("dc-repeat-template-id")].replaceAll("\"", "&quot;").replaceAll("{{", "\" + ").replaceAll("}}", " + \"") + "\"");
                ne.setAttribute("dc-repeat-container-id", e.getAttribute("dc-repeat-template-id"));
                ne.className += " dc-repeat-item";

                e.parentNode.insertBefore(ne, e);
            }
        }
    }

    els = document.getElementsByClassName("dc-output");
    for (i in els) {
        if (!isNaN(i)) {
            var e = els[i];
            e.innerHTML = scope[e.getAttribute("dc-data")];
        }
    }

    var ls = document.getElementsByClassName("dc-ref");

    for (i in ls) {

        if (!isNaN(i)) {

            var e = ls[i];

            if (e.getAttribute("dc-link") == scope.state.link) {
                e.className += " active";
            } else {
                while (e.className.includes("active")) {
                    e.className = e.className.replace("active", "");
                }
            }
        }
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
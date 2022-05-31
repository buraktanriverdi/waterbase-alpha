var nodes;
var nodeTypes;
var pages;
var secectPageIndex = 0;

$.getJSON('/nodes', function (data) {
    nodes = data.nodes;
    pages = data.pages;
    areaSetup();
});
$.getJSON('/nodetypes', function (data) {
    nodeTypes = data;
});

function areaSetup() {
    document.getElementById("area").innerHTML = '<div class="w-full h-screen absolute"><svg id="svgg" style="pointer-events: all;" class="stroke-white hover:stroke-sky-300" width="100%" height="100%" z-index="60" xmlns="http://www.w3.org/2000/svg"></svg></div>';
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].page == pages[secectPageIndex]) {
            document.getElementById("area").appendChild(getNodeElem(nodes[i]));
            dragElement(document.getElementById(nodes[i].id));
        }
    }
    document.getElementById("pageSelectText").innerHTML = pages[secectPageIndex];
    var pageSelectMenu = document.getElementById("pageSelectMenu");
    pageSelectMenu.innerHTML = "";
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] != undefined) {
            pageSelectMenu.innerHTML += "<div onclick='pageSelect(this);' class='px-4 py-1 hover:text-gray-200 hover:bg-black/20 cursor-pointer'>" + pages[i] + "</div>";
        }
    }
    pageSelectMenu.innerHTML += "<div onclick='addPage();' class='border-t border-gray-300/10 px-4 py-1 hover:text-gray-200 hover:bg-black/20 cursor-pointer'>Add</div>";
    createPath();
    setTimeout(mousePathSetup, 50);
}

function getId() {
    var id = Math.floor(Math.random() * 1000);
    var valid = true;
    while (valid) {
        valid = false;
        id = Math.floor(Math.random() * 1000);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == id) {
                valid = true;
            }
        }
    }
    return id;
}

function getAddMenu_copy() {
    var blur = document.createElement('div');
    blur.className = "w-full h-full fixed backdrop-blur-sm bg-gray-900/30";
    blur.appendChild(getMenu());
    blur.id = "add-menu";
    document.getElementById("full-page").appendChild(blur);

    function getMenu() {
        var menu = document.createElement("div");
        menu.className = getClass("menu");
        menu.appendChild(getHeader());
        var magin = document.createElement("div");
        magin.className = "w-full mb-12";
        menu.appendChild(magin);

        for (var i = 0; i < nodeTypes.length; i++) {
            menu.appendChild(getCategory(nodeTypes[i]));
        }

        function getHeader() {
            var header = document.createElement("div");
            header.className = "select-none rounded-t-lg fixed bg-neutral-100/30 dark:bg-slate-800/30 backdrop-blur-sm";
            header.appendChild(getFlex());
            function getFlex() {
                var flex = document.createElement("div");
                flex.className = "flex flex-row p-2 border-b border-gray-300 dark:border-sky-300/50";
                var title = document.createElement("div");
                title.className = "grow select-none cursor-default";
                title.innerHTML = "<p>Add Node</p>";
                flex.appendChild(title);
                flex.appendChild(closeBtn());

                function closeBtn() {
                    var close = document.createElement("div");
                    close.className = "flex-none";
                    close.title = "Close";

                    var btn = document.createElement("div");
                    btn.className = getClass("closeBtn");
                    btn.id = "closeMenu";
                    btn.onclick = function () {
                        document.getElementById("add-menu").remove();
                    }
                    btn.innerHTML = '<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" stroke="currentColor" aria-hidden="true">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

                    close.appendChild(btn);
                    return close;
                }
                return flex;
            }
            return header;
        }
        function getCategory(cat) {
            var category = document.createElement("div");
            category.className = "px-2";
            category.style.zIndex = 100;
            var catTitle = document.createElement("div");
            catTitle.className = "border-b mt-2 mb-1 border-gray-300/50 dark:border-sky-300/20 cursor-default overflow-y-scroll";
            catTitle.innerHTML = cat.name;
            category.appendChild(catTitle);

            for (var i = 0; i < cat.nodes.length; i++) {
                category.appendChild(getNodeType(cat.nodes[i]));
            }

            function getNodeType(catNode) {
                var nodeType = document.createElement("div");
                nodeType.className = "px-2 cursor-pointer hover:text-sky-900 dark:hover:text-sky-300";
                nodeType.innerHTML = catNode.name;
                nodeType.onclick = function () {
                    createNewNode(catNode);
                }
                return nodeType;
            }
            return category;
        }
        return menu;
    }
}

function getAddMenu() {
    var blur = document.createElement('div');
    blur.className = "w-full h-full fixed backdrop-blur-sm bg-gray-900/30";
    blur.appendChild(getMenu());
    blur.id = "add-menu";
    blur.onclick = function () {
        document.getElementById("add-menu").remove();
    }
    document.getElementById("full-page").appendChild(blur);

    function getMenu() {
        var menu = document.createElement("div");
        menu.className = getClass("menu");
        menu.appendChild(getHeader());
        menu.appendChild(getScrollMenu());
        menu.onclick = function () {
            console.log("a");
        }
        function getScrollMenu() {
            var scroll = document.createElement("div");
            scroll.className = "overflow-y-scroll h-full pb-2";
            scroll.appendChild(document.createElement("br"));
            scroll.appendChild(document.createElement("br"));
            for (var i = 0; i < nodeTypes.length; i++) {
                scroll.appendChild(getCategory(i));
            }

            function getCategory(i) {
                var category = document.createElement("div");
                category.className = "px-1";
                category.innerHTML = "<p class='font-bold border-b border-gray-300/50 mt-1 pl-1 cursor-default dark:border-sky-300/10'>" + nodeTypes[i].name + "</p>";
                for (var j = 0; j < nodeTypes[i].nodes.length; j++) {
                    category.appendChild(getNodeType(nodeTypes[i].nodes[j]));
                }

                function getNodeType(nodeType) {
                    var node = document.createElement("p");
                    node.className = "pl-2 cursor-pointer hover:text-white dark:hover:text-sky-300 hover:bg-black/10 rounded-lg";
                    node.innerHTML = nodeType.name;
                    node.onclick = function () {
                        createNewNode(nodeType);
                    }
                    return node;
                }

                return category;
            }

            return scroll;
        }

        function getHeader() {
            var header = document.createElement("div");
            header.className = "select-none rounded-t-lg fixed absolute w-full bg-neutral-100/30 dark:bg-slate-800/30 backdrop-blur-sm";
            header.appendChild(getFlex());
            function getFlex() {
                var flex = document.createElement("div");
                flex.className = "flex flex-row p-2 border-b border-gray-300 dark:border-sky-300/50";
                var title = document.createElement("div");
                title.className = "grow select-none cursor-default";
                title.innerHTML = "<p>Add Node</p>";
                flex.appendChild(title);
                flex.appendChild(closeBtn());

                function closeBtn() {
                    var close = document.createElement("div");
                    close.className = "flex-none";
                    close.title = "Close";

                    var btn = document.createElement("div");
                    btn.className = getClass("closeBtn");
                    btn.id = "closeMenu";
                    btn.onclick = function () {
                        document.getElementById("add-menu").remove();
                    }
                    btn.innerHTML = '<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" stroke="currentColor" aria-hidden="true">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

                    close.appendChild(btn);
                    return close;
                }
                return flex;
            }
            return header;
        }

        return menu;
    }
}

var saving = false;
function save() {
    if (!saving) {
        saving = true;
        document.getElementById("save-text").innerHTML = "Saving...";
        document.getElementById("save-ani").classList.remove("hidden");
        $.ajax({
            url: '/save-admin',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ pages: pages.filter(n => n), nodes: nodes }),
            dataType: 'json',
            statusCode: {
                200: function (data) {
                    console.log(data);
                    setTimeout(function () {
                        document.getElementById("save-text").innerHTML = "Save";
                        document.getElementById("save-ani").classList.add("hidden");
                        saving = false;
                    }, 500);
                }
            }
        });
    }
}

function createNewNode(node) {
    document.getElementById("add-menu").remove();

    id = getId();
    var newNode = JSON.parse(JSON.stringify(node));
    newNode.id = id;
    newNode.location = {
        x: "150px",
        y: "150px",
        z: 50
    };
    newNode.page = pages[secectPageIndex];
    nodes.push(newNode);

    document.getElementById("area").appendChild(getNodeElem(nodes[getNodeIndexById(id)]));
    dragElement(document.getElementById(id));
    createPath();
    for (var j = 0; j < nodes[getNodeIndexById(id)].outputs.length; j++) {
        dragPath(document.getElementById(id + "_out_" + j));
    }
}

function mousePathSetup() {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].page == pages[secectPageIndex]) {
            for (var j = 0; j < nodes[i].outputs.length; j++) {
                dragPath(document.getElementById(nodes[i].id + "_out_" + j));
            }
        }
    }
}

function pathClick(e) {
    try {
        document.getElementById("menu").remove();
    } catch (e) { }
    var menu = document.createElement("div");
    menu.id = "menu";
    menu.className = getClass("click_menu");

    menu.appendChild(menuItem("X", () => {
        document.getElementById("menu").remove();
    }, true));
    menu.appendChild(menuItem("Delete", () => {
        pathDelete(e.id);
        document.getElementById("menu").remove();
    }));

    var top = (parseInt(e.getAttribute("d").split(" ")[2]) + parseInt(e.getAttribute("d").split(" ")[12])) / 2;
    var left = (parseInt(e.getAttribute("d").split(" ")[1]) + parseInt(e.getAttribute("d").split(" ")[11])) / 2;

    menu.style.top = top + "px";
    menu.style.left = left + "px";
    menu.style.zIndex = "100";
    document.getElementById("area").appendChild(menu);

    function menuItem(text, func, alignRight) {
        var item = document.createElement("div");
        item.innerHTML = "<p>" + text + "</p>";
        item.className = "px-2 rounded-md hover:text-sky-900 dark:hover:text-sky-300 cursor-pointer";
        item.className += alignRight ? " text-right bg-gray-500/20 dark:bg-sky-300/10 hover:bg-gray-500/30 dark:hover:bg-sky-500/10 mb-2" : " hover:bg-gray-100/10 dark:hover:bg-gray-800/10";
        item.onclick = func;
        return item;
    }
}

function getClass(name) {
    let classTW = [
        {
            name: "menu",
            string: "inset-0 mt-48 mx-auto backdrop-blur-sm pb-1 w-1/3 h-4/6 select-none shadow-xl absolute rounded-lg bg-neutral-100/30 dark:bg-slate-800/30 border border-gray-300 dark:border-sky-300/50 text-neutral-700 dark:text-white"
        },
        {
            name: "node",
            string: "backdrop-blur-sm pb-1 select-none shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-900/20 absolute rounded-lg bg-neutral-100/30 dark:bg-slate-800/30 border border-gray-300 dark:border-sky-300/50 text-neutral-700 dark:text-white"
        },
        {
            name: "click_menu",
            string: "absolute p-1 w-32 backdrop-blur-sm select-none shadow-xl hover:shadow-sky-500/20 dark:hover:shadow-sky-900 absolute rounded-lg bg-neutral-100/10 dark:bg-slate-700/10 border border-gray-300 dark:border-sky-300/50 text-neutral-700 dark:text-white"
        },
        {
            name: "node-header",
            string: "p-2 pl-4 mb-2 border-b border-gray-200 shadow dark:border-sky-300/60 bg-gradient-to-r from-sky-900/20 dark:from-slate-700 text-gray-900 dark:text-white rounded-t-lg z-10 w-full cursor-move"
        },
        {
            name: "closeBtn",
            string: "cursor-pointer float-right rounded-md inline-flex items-center justify-center dark:text-gray-400 hover:text-sky-900 dark:hover:text-sky-300/60 border border-slate-700 dark:border-gray-500 hover:border-sky-800 hover:shadow-xl dark:hover:border-sky-300/60"
        }
    ];
    for (var i = 0; i < classTW.length; i++) {
        if (classTW[i].name == name) {
            return classTW[i].string;
        }
    }
    return "";
}

function inputOnChange(e) {
    var nodeIndex = getNodeIndexById(e.id.split("_")[0]);
    var inputIndex = e.id.split("_")[2];
    nodes[nodeIndex].inputs[inputIndex].value = e.value;
}

function inputJsonOnChange(e) {
    var nodeIndex = getNodeIndexById(e.id.split("_")[0]);
    nodes[nodeIndex].inputs[0].value = e.value;

    var ugly = document.getElementById(e.id).value;
    var obj = JSON.parse(ugly);
    var pretty = JSON.stringify(obj, undefined, 4);
    document.getElementById(e.id).value = pretty;
}

function onTestChange(e) {
    var key = window.event.keyCode;

    if (key === 13) {
        var ugly = document.getElementById(e.id).value;
        var obj = JSON.parse(ugly);
        var pretty = JSON.stringify(obj, undefined, 4);
        document.getElementById(e.id).value = pretty;
        return false;
    }
    else {
        return true;
    }
}

function nodeClose(e) {
    var nodeIndex = getNodeIndexById(e.id.split("_")[0]);
    var nodeID = e.id.split("_")[0];
    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < nodes[i].inputs.length; j++) {
            try {
                if (nodes[i].inputs[j].connection != false && nodes[i].inputs[j].connection.nodeId == nodeID) {
                    nodes[i].inputs[j].connection = false;
                }
            }
            catch (e) { }
        }
        for (var j = 0; j < nodes[i].outputs.length; j++) {
            try {
                if (nodes[i].outputs[j].connection != false && nodes[i].outputs[j].connection.nodeId == nodeID) {
                    nodes[i].outputs[j].connection = false;
                }
            }
            catch (e) { }
        }
    }
    nodes.splice(nodeIndex, 1);
    document.getElementById(e.id.split("_")[0]).remove();
    setTimeout(createPath, 50);
}

function pathDelete(pathID) {
    var from = pathID.split("-")[0];
    var to = pathID.split("-")[2];
    var type = from.split("_")[1] == "in" ? "trigger" : "value";
    if (type == "trigger") {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == to.split("_")[0]) {
                for (var j = 0; j < nodes[i].outputs.length; j++) {
                    if (j == to.split("_")[2]) {
                        nodes[i].outputs[j].connection = false;
                        break;
                    }
                }
            }
        }
    } else if (type == "value") {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id == to.split("_")[0]) {
                for (var j = 0; j < nodes[i].inputs.length; j++) {
                    if (j == to.split("_")[2]) {
                        nodes[i].inputs[j].connection = false;
                        break;
                    }
                }
            }
        }
    }
    document.getElementById(pathID).remove();
    setTimeout(createPath, 50);
}

function getNodeElem(nodeType) {
    var node = document.createElement("div");
    node.className = getClass("node");
    node.id = nodeType.id;
    node.style.top = nodeType.location.y;
    node.style.left = nodeType.location.x;
    node.style.zIndex = nodeType.location.z;

    node.appendChild(nodeHeader());
    node.appendChild(nodeBody());

    function nodeHeader() {
        var nodeHeader = document.createElement("div");
        nodeHeader.className = getClass("node-header");
        nodeHeader.style = "min-width: 12rem;";
        nodeHeader.id = nodeType.id + "_node-header";
        nodeHeader.title = nodeType.description;

        nodeHeader.appendChild(flex());

        function flex() {
            var flex = document.createElement("div");
            flex.className = "flex";

            var name = document.createElement("div");
            name.className = "flex-none mr-2";
            name.innerHTML = nodeType.name + " [" + nodeType.id + "]";

            var grow = document.createElement("div");
            grow.className = "grow";

            var close = closeBtn(nodeType.id);

            flex.appendChild(name);
            flex.appendChild(grow);
            flex.appendChild(close);

            function closeBtn() {
                var close = document.createElement("div");
                close.className = "flex-none";
                close.title = "Remove node";

                var btn = document.createElement("div");
                btn.className = getClass("closeBtn");
                btn.id = nodeType.id + "_closeBtn";
                btn.onclick = function () {
                    nodeClose(this);
                }
                btn.innerHTML = '<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" stroke="currentColor" aria-hidden="true">' +
                    '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

                close.appendChild(btn);

                return close;
            }

            return flex;
        }
        return nodeHeader;
    }

    function nodeBody() {
        var nodeBody = document.createElement("div");
        var length = 0;
        if (nodeType.inputs != null && nodeType.outputs != null) {
            nodeType.inputs.length > nodeType.outputs.length ? length = nodeType.inputs.length : length = nodeType.outputs.length;
        }
        else {
            if (nodeType.inputs != null) {
                length = nodeType.inputs.length;
            }
            else if (nodeType.outputs != null) {
                length = nodeType.outputs.length;
            }
            else {
                length = 0;
            }
        }
        for (var i = 0; i < length; i++) {
            nodeBody.appendChild(nodeRow(i));
        }

        function nodeRow(index) {
            var row = document.createElement("div");
            row.className = "flex flex-row";

            var grow = document.createElement("div");
            grow.className = "grow min-w-10";

            if (nodeType.inputs != null && nodeType.inputs[index] != undefined) {
                row.appendChild(getIcon(nodeType.inputs[index].type, nodeType.id + "_in_" + index));
                var nameLeft = document.createElement("div");
                nameLeft.className = "pr-4 cursor-default";
                if (nodeType.inputs[index].name == "static") {
                    nameLeft.innerHTML = "<input id='" + nodeType.id + "_in_" + index + "' onchange='inputOnChange(this)' class='flex w-20 ml-2 focus:outline-none border border-sky-600/10 focus:border-sky-300/50 bg-gray-900/10 rounded-lg' type='text' value='"
                        + nodeType.inputs[index].value + "'>";
                }
                else if (nodeType.inputs[index].name == "static_json") {
                    var btn = document.createElement("div");
                    btn.className = "flex px-2 ml-2 focus:outline-none border border-sky-600/10 hover:border-sky-300/50 bg-sky-600/20 hover:bg-sky-600/30 rounded-lg cursor-pointer";
                    btn.innerHTML = "edit";
                    btn.onclick = function () {
                        var x = document.getElementById(nodeType.id + "_in_0_a");
                        if (x.style.display === "none") {
                            x.style.display = "block";
                            this.innerHTML = "close";
                        } else {
                            x.style.display = "none";
                            this.innerHTML = "edit";
                        }
                    }
                    nameLeft.innerHTML += "<textarea id='" + nodeType.id + "_in_0_a' onchange='inputJsonOnChange(this);' onkeypress='onTestChange(this);' style='display:none;' class='resize absolute mt-10 w-full focus:outline-none border border-sky-300/50 focus:border-sky-300/60 backdrop-blur-sm bg-neutral-100/90 dark:bg-slate-800/30 rounded-lg z-50' type='text'>"
                        + nodeType.inputs[index].value + "</textarea>";
                    nameLeft.appendChild(btn);
                }
                else {
                    nodeType.inputs[index].description !== undefined ? nameLeft.title = nodeType.inputs[index].description : nameLeft.title = "";
                    nameLeft.innerHTML = nodeType.inputs[index].name;
                }
                row.appendChild(nameLeft);
            }

            row.appendChild(grow);

            if (nodeType.outputs != null && nodeType.outputs[index] != undefined) {
                var nameRight = document.createElement("div");
                nameRight.style.cursor = "default";
                nodeType.outputs[index].description !== undefined ? nameRight.title = nodeType.outputs[index].description : nameRight.title = "";
                nameRight.innerHTML = nodeType.outputs[index].name + '&zwnj;';
                row.appendChild(nameRight);
                row.appendChild(getIcon(nodeType.outputs[index].type, nodeType.id + "_out_" + index));
            }

            function getIcon(type, icoId) {
                if (type == undefined || type == null) {
                    var nullDiv = document.createElement("div");
                    return nullDiv;
                }
                var icon = document.createElement("div");
                icon.title = type;
                icon.id = icoId;
                icon.style.zIndex = 56;

                if (type == "trigger" || type == "cTrigger") {
                    icoId.split("_")[1] == "in" ? icon.className = "flex-none px-1" : icon.className = "flex-none px-1 cursor-pointer";
                    icon.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='h-full w-5 text-gray-500 dark:text-slate-700 stroke-gray-800 dark:stroke-white fill-white "
                        + "' viewBox='0 0 24 24' stroke-width='2'>" +
                        "<path stroke-linecap='round' stroke-linejoin='round' d='M 7 4 L 7 19 L 17 14 C 22 11 22 12 17 9 L 7 4' /></svg>";
                }
                else if (type == "staticVar") { }
                else if (type == "event") {
                    icon.className = "flex-none px-1";
                    icon.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' class='h-full w-5 text-gray-500 dark:text-slate-700 stroke-gray-800 dark:stroke-white fill-white "
                        + "' viewBox='0 0 24 24' stroke-width='2'>" +
                        "<path stroke-linecap='round' stroke-linejoin='round' d='m 17 11 L 17 12 L 10 12 L 10 17 L 17 17 L 17 18 L 9 18 L 9 6 L 17 6 L 17 7 L 10 7 L 10 11 L 17 11' /></svg>";
                }
                else {
                    icoId.split("_")[1] == "in" ? icon.className = "flex-none px-1" : icon.className = "flex-none px-1 cursor-pointer";
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-full w-5 text-gray-200 stroke-gray-500 dark:stroke-gray-500 dark:text-slate-700 fill-current '
                        + (icoId.split("_")[1] == "in" ? "" : "hover:stroke-sky-400/20 hover:fill-sky-500")
                        + '" viewBox="0 0 24 24" stroke-width="2">' +
                        '<path stroke-linecap="round" stroke-linejoin="round" d="M 12 20 a 8 8 0 1 0 0 -16 a 8 8 0 0 0 0 16 z z" /></svg>';
                }
                return icon;
            }
            return row;
        }
        return nodeBody;
    }
    return node;
}

function getPos(elem) {
    return {
        y: elem.offsetTop + elem.offsetParent.offsetTop,
        x: elem.offsetLeft + elem.offsetParent.offsetLeft
    }
}

function createPath() {
    var svgg = document.getElementById("svgg");
    svgg.innerHTML = "";
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].page == pages[secectPageIndex]) {
            for (var j = 0; j < nodes[i].inputs.length; j++) { //data
                if (nodes[i].inputs[j].connection != false && nodes[i].inputs[j].connection != undefined) {
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.onclick = function () {
                        pathClick(this);
                    }
                    path.setAttribute("d", "");
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        path.setAttribute("stroke", "rgb(186 230 253 / 1)");
                    } else {
                        path.setAttribute("stroke", "#94a3b8");
                    }
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("stroke-dasharray", "2.5");
                    path.setAttribute("fill", "none");
                    path.style = "cursor:pointer; pointer-events:all;";
                    path.onmouseover = function () {
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            this.style.stroke = 'rgb(250 250 250 / 1)';
                        } else {
                            this.style.stroke = '#1e293b';
                        }
                    }
                    path.onmouseout = function () {
                        this.style.stroke = 'rgb(186 230 253 / 1)';
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            this.style.stroke = 'rgb(186 230 253 / 1)';
                        } else {
                            this.style.stroke = '#94a3b8';
                        }
                    }
                    path.id = nodes[i].inputs[j].connection.nodeId + "_out_" + nodes[i].inputs[j].connection.nodeOutput + "-to-" + nodes[i].id + "_in_" + j;
                    document.getElementById("svgg").appendChild(path);
                }
            }
            for (var j = 0; j < nodes[i].outputs.length; j++) { //function
                if (nodes[i].outputs[j].connection != undefined && nodes[i].outputs[j].connection != false) {
                    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.onclick = function () {
                        pathClick(this);
                    }
                    path.setAttribute("d", "");
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                        path.setAttribute("stroke", "rgb(125 211 252 / 1)");
                    } else {
                        path.setAttribute("stroke", "#94a3b8");
                    }
                    path.setAttribute("stroke-width", "2");
                    path.setAttribute("fill", "none");
                    path.style = "cursor:pointer; pointer-events:all;";
                    path.onmouseover = function () {
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            this.style.stroke = 'white';
                        } else {
                            this.style.stroke = '#1e293b';
                        }
                    }
                    path.onmouseout = function () {
                        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                            this.style.stroke = 'rgb(125 211 252 / 1)';
                        } else {
                            this.style.stroke = '#94a3b8';
                        }
                    }
                    path.id = nodes[i].outputs[j].connection.nodeId + "_in_" + nodes[i].outputs[j].connection.nodeInput + "-to-" + nodes[i].id + "_out_" + j;
                    document.getElementById("svgg").appendChild(path);
                }
            }
        }
    }
    setTimeout(updatePaths, 50);
}

function updatePaths() {
    try {
        document.getElementById("menu").remove();
    } catch (e) { }
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].page == pages[secectPageIndex]) {
            for (var j = 0; j < nodes[i].inputs.length; j++) {
                if (nodes[i].inputs[j].connection != false && nodes[i].inputs[j].connection != undefined) {
                    var path = document.getElementById(nodes[i].inputs[j].connection.nodeId + "_out_" + nodes[i].inputs[j].connection.nodeOutput + "-to-" + nodes[i].id + "_in_" + j);
                    path.setAttribute("d", getPath(nodes[i].inputs[j].connection.nodeId, nodes[i].inputs[j].connection.nodeOutput, nodes[i].id, j));
                }
            }
            for (var j = 0; j < nodes[i].outputs.length; j++) {
                if (nodes[i].outputs[j].connection != false && nodes[i].outputs[j].connection != undefined) {
                    //console.log(nodes[i].outputs[j].connection.nodeId + "_in_" + nodes[i].outputs[j].connection.nodeInput + "-to-" + nodes[i].id + "_out_" + j);
                    var path = document.getElementById(nodes[i].outputs[j].connection.nodeId + "_in_" + nodes[i].outputs[j].connection.nodeInput + "-to-" + nodes[i].id + "_out_" + j);
                    path.setAttribute("d", getPath(nodes[i].id, j, nodes[i].outputs[j].connection.nodeId, nodes[i].outputs[j].connection.nodeInput));
                }
            }
        }

    }
}

function getPath(outNodeId, outIndex, inNodeId, inIndex) { //returns the path code
    var outNode = document.getElementById(outNodeId + "_out_" + outIndex);
    var inNode = document.getElementById(inNodeId + "_in_" + inIndex);

    let curve = 60;

    var xSt = getPos(outNode).x + 17;
    var ySt = getPos(outNode).y + 16;
    var xEnd = getPos(inNode).x + 13;
    var yEnd = getPos(inNode).y + 12;

    var pt = "M " + xSt + " " + ySt + " Q " + (curve + xSt) + " " + ySt + " " + (xEnd - ((xEnd - xSt) / 2)) + " " + (((yEnd - ySt) / 2) + ySt) + " Q " + (xEnd - curve) + " " + yEnd + " " + xEnd + " " + yEnd;

    return pt;
}

function getPathMouse(xSt, ySt, xEnd, yEnd) { //returns the path code
    curve = 60;
    var pt = "M " + xSt + " " + ySt + " Q " + (curve + xSt) + " " + ySt + " " + (xEnd - ((xEnd - xSt) / 2)) + " " + (((yEnd - ySt) / 2) + ySt) + " Q " + (xEnd - curve) + " " + yEnd + " " + xEnd + " " + yEnd;
    return pt;
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "_node-header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "_node-header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        elmnt.style.zIndex = 55;
        updatePaths();
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        nodes[getNodeIndexById(elmnt.id)].location.x = elmnt.style.left;
        nodes[getNodeIndexById(elmnt.id)].location.y = elmnt.style.top;
        nodes[getNodeIndexById(elmnt.id)].location.z = 51;
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].page == pages[secectPageIndex]) {
                if (nodes[i].location.z > 25) {
                    nodes[i].location.z--;
                }
                document.getElementById(nodes[i].id).style.zIndex = nodes[i].location.z;
            }
        }
    }
}

function dragPath(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("fill", "none");
        path.id = "mousePath";
        document.getElementById("svgg").appendChild(path);

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;

        document.getElementById("mousePath").setAttribute("d", getPathMouse(getPos(elmnt).x + 17, getPos(elmnt).y + 16, pos1 + getPos(elmnt).x + 17, pos2 + getPos(elmnt).y + 18));

        for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < nodes[i].inputs.length; j++) {
                try {
                    var dot = getPos(document.getElementById(nodes[i].id + "_in_" + j));
                    dot.x += 17;
                    dot.y += 18;
                    var mouseX = pos1 + getPos(elmnt).x + 17;
                    var mouseY = pos2 + getPos(elmnt).y + 18;
                    if (mouseX - dot.x < 15 && mouseX - dot.x > -15 && mouseY - dot.y < 10 && mouseY - dot.y > -10) {
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.fill = "rgba(56,189,248,0.9)";
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.stroke = "white";
                    } else {
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.fill = null;
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.stroke = null;
                    }
                } catch (e) { }
            }
        }
    }

    function closeDragElement() {
        var id = elmnt.id.split("_")[0];
        var index = elmnt.id.split("_")[2];
        for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < nodes[i].inputs.length; j++) {
                try {
                    var dot = getPos(document.getElementById(nodes[i].id + "_in_" + j));
                    dot.x += 17;
                    dot.y += 18;
                    var mouseX = pos1 + getPos(elmnt).x + 17;
                    var mouseY = pos2 + getPos(elmnt).y + 18;
                    if (mouseX - dot.x < 15 && mouseX - dot.x > -15 && mouseY - dot.y < 10 && mouseY - dot.y > -10) {
                        if (getNodeIndexById(i) == id) {
                            document.getElementById("mousePath").remove();
                            document.onmouseup = null;
                            document.onmousemove = null;
                            return;
                        }
                        if (nodes[getNodeIndexById(id)].outputs[index].type == "trigger" || nodes[getNodeIndexById(id)].outputs[index].type == "cTrigger") {
                            console.log("id: " + id + " index: " + index + " i: " + i + " j: " + j);
                            if (nodes[i].inputs[j].type != "trigger") {
                                document.getElementById("mousePath").remove();
                                document.onmouseup = null;
                                document.onmousemove = null;
                                return;
                            }
                            nodes[getNodeIndexById(id)].outputs[index].connection = {
                                nodeId: parseInt(nodes[i].id),
                                nodeInput: parseInt(j)
                            }
                        } else {
                            if (nodes[i].inputs[j].type == "trigger") {
                                document.getElementById("mousePath").remove();
                                document.onmouseup = null;
                                document.onmousemove = null;
                                return;
                            }
                            nodes[i].inputs[j].connection = {
                                nodeId: parseInt(id),
                                nodeOutput: parseInt(index)
                            }
                        }
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.fill = null;
                        document.getElementById(nodes[i].id + "_in_" + j).children[0].style.stroke = null;
                        setTimeout(createPath, 5);
                    }
                } catch (e) { }
            }
        }
        document.getElementById("mousePath").remove();
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function getNodeIndexById(id) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == parseInt(id)) {
            return i;
        }
    }
}

function pageSelectMenuToggle() {
    var menu = document.getElementById("pageSelectMenu");
    var icon = document.getElementById("pageSelectIcon");
    if (menu.style.display === "none") {
        menu.style.display = "block";
        icon.classList.add("rotate-180");
    } else {
        menu.style.display = "none";
        icon.classList.remove("rotate-180");
    }
}

function pageSelect(e) {
    pageSelectMenuToggle();
    var pageText = e.innerHTML;
    for (var i = 0; i < pages.length; i++) {
        if (pages[i] == pageText) {
            secectPageIndex = i;
            document.getElementById("pageSelectText").innerHTML = pageText;
            areaSetup();
        }
    }
}

function addPage() {
    var pageName = prompt("Enter page name", "Page " + (pages.length + 1));
    if (pageName != null) {
        pages.push(pageName);
        document.getElementById("pageSelectText").innerHTML = pageName;
        secectPageIndex = pages.length - 1;
        pageSelectMenuToggle();
        areaSetup();
    }
}

function removePage() {
    if (pages.length > 1) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].page == pages[secectPageIndex]) {
                nodes.splice(i, 1);
                i--;
            }
        }

        delete pages[secectPageIndex];
        secectPageIndex = 0;
        document.getElementById("pageSelectText").innerHTML = pages[secectPageIndex];

        areaSetup();
    }
}

function renamePage() {
    var pageName = prompt("Enter new page name", pages[secectPageIndex]);

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].page == pages[secectPageIndex]) {
            nodes[i].page = pageName;
        }
    }

    pages[secectPageIndex] = pageName;

    areaSetup();
}

document.addEventListener("keydown", function (e) {
    if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
        e.preventDefault();
        save();
    }
}, false);
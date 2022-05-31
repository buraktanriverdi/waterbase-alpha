const fs = require('fs');
const path = require('path');
var wbfunctions = require("./wbFuncs.js").funcs();
var nodes = (JSON.parse(fs.readFileSync(path.join(__dirname, './nodes.json')))).nodes;
var refreshRequired = 0;

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017?retryWrites=true&writeConcern=majority";
const client = new MongoClient(uri);

var debug = false;

function debugLog(text) {
    debug ? console.log(text) : null;
}

function getNodeById(nodeId) {
    return nodes.find(node => node.id === nodeId);
}

function getFuncIndexByName(funcName) {
    for (i = 0; i < wbfunctions.length; i++) {
        if (wbfunctions[i].name === funcName) return i;
    }
}

function Node(nodeId) {
    var node = getNodeById(nodeId);
    this.client = client;
    this.id = node.id;
    this.name = node.name;
    this.inputs = node.inputs;
    this.outputs = node.outputs;
    this.location = node.location;

    this.postData = function () {
        return this.post;
    }
    this.input = function (index) {//node girişine gelen veriyi döndürür
        debugLog(this.id + " " + index + " input");
        if (this.inputs[index].connection != false && this.inputs[index].connection != null) {
            var nd = new Node(this.inputs[index].connection.nodeId);
            if (this.post != undefined) { nd.post = this.post; }
            return nd.output(this.inputs[index].connection.nodeOutput);
        } else if (this.inputs[index].value != null) {
            return this.inputs[index].value;
        }
        else {
            return null;
        }
    }
    this.output = function (index) {//node çıkışına gelen veriyi döndürür
        debugLog(this.id + " " + index + " output");
        return wbfunctions[getFuncIndexByName(this.outputs[index].function)].func.call(this);
    }
    this.trigger = function (index) {//düğümü index ile tetikler
        debugLog(this.id + " " + index + " trigger");
        if (this.inputs[index].type == "trigger" || this.inputs[index].type == "event") {
            wbfunctions[getFuncIndexByName(this.inputs[index].function)].func.call(this);
            for (i = 0; i < this.outputs.length; i++) {
                if (this.outputs[i].type == "trigger" && this.outputs[i].connection != false) {
                    var nd = new Node(this.outputs[i].connection.nodeId);
                    if (this.post != undefined) { nd.post = this.post; }
                    nd.trigger(this.outputs[i].connection.nodeInput);
                }
            }
        }
    }
    this.triggerNode = function (output) {//çıkış tetikleyici
        if (this.outputs[output].connection != false) {
            var nd = new Node(this.outputs[output].connection.nodeId);
            if (this.post != undefined) { nd.post = this.post; }
            nd.trigger(this.outputs[output].connection.nodeInput);
        }
    }
}

exports.newNode = function (index) {
    var nd = new Node(index);
    if(refreshRequired>0){
        wbfunctions = require("./wbFuncs.js").funcs();
        nodes = (JSON.parse(fs.readFileSync(path.join(__dirname, './nodes.json')))).nodes;
        refreshRequired --;
    }
    return nd;
}

exports.newNodeByHttp = function (str, type) {
    wbfunctions = require("./wbFuncs.js").funcs();
    nodes = (JSON.parse(fs.readFileSync(path.join(__dirname, './nodes.json')))).nodes;

    var nodeName = "";
    switch(type){
        case "post":
            nodeName = "Post Request";
            break;
        case "get":
            nodeName = "Get Request";
            break;
        case "wb-com":
            nodeName = "WB User Request";
            break;
    }

    var index;
    for (var i = 0; i < nodes.length; i++) {
        try{
            if (nodes[i].inputs[1].value == str && nodes[i].name == nodeName) {
                index = nodes[i].id;
            }
        } catch (e) {
        }
    }
    if(index == undefined || index == null){
        return null;
    } else {
        var nd = new Node(index);
        return nd;
    }
}

exports.refresh = function () {
    refreshRequired = 10;
}
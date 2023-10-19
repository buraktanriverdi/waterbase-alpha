const express = require('express');
var Node = require('./wbEng.js');
var server = express();
const fs = require('fs');
const crypto = require('crypto');

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017?retryWrites=true&writeConcern=majority";
const client = new MongoClient(uri);

var path = require('path');
const { ObjectID } = require('bson');
var public = path.join(__dirname, 'public');
var admin = path.join(__dirname, 'admin');

server.get('/burak', function (req, res) {
    console.log(req.query);
    res.sendFile(path.join(public, 'index.html'));
});

server.get('/nodes', function (req, res) {
    res.sendFile('./admin/nodes.json', { root: __dirname });
});
server.get('/nodetypes', function (req, res) {
    res.sendFile('./nodeTypes.json', { root: __dirname });
});

server.use(express.json());

server.post('/save-admin', function (req, res) {
    fs.writeFile("./admin/nodes.json", JSON.stringify(req.body), function writeJSON(err) {
        if (err) return res.send(err);
        console.log('saving');
    });
    Node.refresh();
    res.send("ok");
});

server.post('/wb-com-begin', async function (req, res) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    })

    var publicKeyString = publicKey.export({ type: 'spki', format: 'pem' });
    var privateKeyString = privateKey.export({ type: 'pkcs8', format: 'pem' });

    var data = {
        publicKey: publicKeyString,
        privateKey: privateKeyString,
        username: req.body.username,
    };

    var collection = client.db("waterbase").collection("users");
    await client.connect();
    var inserted = await collection.insertOne(data);
    var id = JSON.parse(JSON.stringify(inserted)).insertedId;
    res.send({ id: id, pub: publicKeyString });
});

server.post('/wb-com/:str', async function (req, res) {
    var str = req.params.str || '';
    var userId = req.body.id || '';
    var dataEncrypted = Buffer.from(req.body.data, "base64");

    var collection = client.db("waterbase").collection("users");
    await client.connect();
    var user = await collection.findOne({ _id: new ObjectID(userId) });
    var privateKeyString = JSON.parse(JSON.stringify(user)).privateKey;

    try {
        var dataDecrypted = crypto.privateDecrypt(privateKeyString, dataEncrypted);
        var nd = Node.newNodeByHttp(str, "wb-com");
        if (nd == null) {
            res.send("not found");
        } else {
            nd.post = {
                request: req,
                response: res,
                id: userId,
                data: dataDecrypted.toString("utf-8")
            }
            nd.trigger(0);
        }
    } catch (err) {
        console.log(err);
        res.send("error");
    }
});

server.post('/wb-http/:str', function (req, res) {
    var str = req.params.str || '';
    var nd = Node.newNodeByHttp(str, "post");
    if (nd == null) {
        res.send("not found");
    } else {
        nd.post = {
            request: req,
            response: res
        }
        nd.trigger(0);
    }
});

server.get('/wb-http/:str', function (req, res) {
    var str = req.params.str || '';
    var nd = Node.newNodeByHttp(str, "get");
    if (nd == null) {
        res.send("not found");
    } else {
        nd.post = {
            request: req,
            response: res
        }
        nd.trigger(0);
    }

});


server.use('/admin', express.static(admin));
server.use(express.static(public));

server.listen(8084);
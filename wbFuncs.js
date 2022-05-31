var funcs = [
    {
        name: "cLog",
        func: async function () {
            var msg = await this.input(1);
            console.log(msg);
        }
    },
    {
        name: "aPlusb",
        func: function () {
            return this.input(0) + this.input(1);
        }
    },
    {
        name: "getTb",
        func: function () {
            return this.input(0);
        }
    },
    {
        name: "getJsonArea",
        func: function () {
            return JSON.parse(this.input(0));
        }
    },
    {
        name: "equalTrigger",
        func: async function () {
            var inp1 = await this.input(1);
            var inp2 = await this.input(2);
            this.triggerNode((inp1 == inp1) ? 0 : 1);
        }
    },
    {
        name: "getBody",
        func: function () {
            return this.postData().request.body;
        }
    },
    {
        name: "getQuery",
        func: function () {
            return this.postData().request.query;
        }
    },
    {
        name: "getID",
        func: function () {
            return this.postData().id;
        }
    },
    {
        name: "getBodyWB",
        func: async function () {
            return await this.postData().data;
        }
    },
    {
        name: "resSend",
        func: async function () {
            var msg = await this.input(1);
            if(typeof msg == "string" || typeof msg == "object"){
                this.postData().response.send(msg);
            } else {
                this.postData().response.send(JSON.stringify(msg));
            }
            this.postData
        }
    },
    {
        name: "postEvent",
        func: function () {

        }
    },
    {
        name: "getEvent",
        func: function () {

        }
    },
    {
        name: "find",
        func: async function () {
            var dbName = await this.input(0);
            var collectionName = await this.input(1);
            var query = await this.input(2);

            const database = this.client.db(dbName);
            const collection = database.collection(collectionName);
            await this.client.connect();
            return await collection.find(query).toArray();
        }
    },
    {
        name: "distinct",
        func: async function () {
            var dbName = await this.input(0);
            var collectionName = await this.input(1);
            var distinct = await this.input(2)
            var query = await this.input(3);

            const database = this.client.db(dbName);
            const collection = database.collection(collectionName);
            await this.client.connect();
            return await collection.distinct(distinct, query);
        }
    },
    {
        name: "insertOne",
        func: async function () {
            var dbName = await this.input(1);
            var collectionName = await this.input(2);
            var data = await this.input(3);

            data.date = new Date();

            const database = this.client.db(dbName);
            const collection = database.collection(collectionName);
            await this.client.connect();
            await collection.insertOne(data, function (err, res) {
                if (err) throw err;
            });
        }
    },
    {
        name: "idToUser",
        func: async function () {
            const Mongo = require("mongodb");
            var dbName = "waterbase";
            var collectionName = "users";
            var data = await this.input(0);

            const database = this.client.db(dbName);
            const collection = database.collection(collectionName);
            await this.client.connect();
            var users = [];
            for(var i = 0; i < data.length; i++) {
                var o_id = new Mongo.ObjectID(data[i]);
                var user = JSON.parse(JSON.stringify((await collection.findOne({ _id: o_id }))));
                users[i] = {id:user._id,username:user.username};
            }
            return users;
        }
    },
    {
        name: "jsonParse",
        func: async function () {
            var json = await this.input(0);
            return JSON.parse(json);
        }
    },
    {
        name: "jsonStringify",
        func: async function () {
            var json = await this.input(0);
            return JSON.stringify(json);
        }
    },
    {
        name: "jsonGetKey",
        func: async function () {
            var json = await this.input(0);
            var key = await this.input(1);
            return json[key];
        }
    },
    {
        name: "jsonSetKey",
        func: async function () {
            var json = await this.input(0);
            var key = await this.input(1);
            var value = await this.input(2);
            json[key] = value;
            return json;
        }
    },
    {
        name: "toInt",
        func: async function () {
            var str = await this.input(0);
            return parseInt(str);
        }
    },
    {
        name: "mongoQueryOR",
        func: async function () {
            var a = await this.input(0);
            var b = await this.input(1);
            var query = {
                $or: [a,b]
            }
            return query;
        }
    },
    {
        "name":"onWaterReq",
        "func":async function(){

        }
    }
];

exports.funcs = function () {
    return funcs;
}
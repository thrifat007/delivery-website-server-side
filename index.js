const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000

//miidleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASS}@cluster0.1bsr5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);

// main
async function run() {
    try {
        await client.connect();
        console.log('connection establised');

        // db cluster name 
        const database = client.db('pizzon');
        const servicesCollection = database.collection('pizzonItems');
        const addOrderCollection = database.collection("addOrder");

        // just for create an automated db name and collection
        // const data = { serviceName: 'Food giving', serviceDetails: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate minima, nobis laboriosam eum autem nam suscipit itaque quos expedita quidem atque tenetur ipsum sequi sed eligendi quam enim amet debitis?" }
        // servicesCollection.insertOne(data);


        // GET API
        app.get('/services', async (req, res) => {
            const readData = servicesCollection.find({});
            const serviceData = await readData.toArray();
            res.send(serviceData);
        })

        // GET SINGLE ITEM
        app.get('/services/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const singleService = await servicesCollection.findOne(query);
            res.json(singleService);
        })

        // UPDATE API
        // app.put('/services/:id', async (req, res) => {
        //     const itemId = req.params.id;
        //     const updateItem = req.body;
        //     const query = { _id: ObjectId(itemId) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             serviceName: updateItem.serviceName,
        //             serviceDetails: updateItem.serviceDetails,
        //             imageUrl: updateItem.imageUrl,

        //         },
        //     };

        //     const updatedResult = await servicesCollection.updateOne(query, options, updateDoc);
        //     console.log('updating  user', req);
        //     res.json(updatedResult)
        // })


        // POST API
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const postResult = await servicesCollection.insertOne(newService);

            console.log('added user', postResult);
            res.json(postResult);

        })

        // Delete API
        app.delete('/services/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            console.log(query);
            const deleteResult = await servicesCollection.deleteOne(query);
            console.log('Deleting user', deleteResult);
            res.json(deleteResult);
        })


        // CART ITEMS

        //Add an user trying
        app.post('/addOrders', async (req, res) => {
            //REQ.BODY WE GOT FROM CLIENT SIDE
            const addOrder = req.body;
            //DATABASE PUSH 
            const result = await addOrderCollection.insertOne(addOrder)

            console.log('Got new user', req.body)
            console.log('added user', result)
            res.send(result)
        });

        //get an user
        app.get('/addOrders', async (req, res) => {
            const cursor = addOrderCollection.find({});
            const users = await cursor.toArray();
            res.send(users)
        })

        // GET SINGLE ITEM
        app.get('/addOrders/:id', async (req, res) => {
            const itemId = req.params.id;
            const query = { _id: ObjectId(itemId) };
            const singleService = await addOrderCollection.findOne(query);
            res.json(singleService);
        })



        // Update API
        app.put('/addOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'approved'
                },

            }
            const result = await addOrderCollection.updateOne(filter, updateDoc, options)
            console.log('updating user', req)
            res.json(result)
        })


        //DELETE API
        app.delete('/addOrders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await addOrderCollection.deleteOne(query)
            console.log('deleting user with id', result);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hey, The Server is Live!!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
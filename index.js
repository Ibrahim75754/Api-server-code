const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvhfe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("database connected");
        const database = client.db('radio-widget');
        const stationsCollection = database.collection('station');
        

        //.................station...............................
        // insert one station...............
        app.post('/stations', async (req, res) => {
            const station= req.body;
            const result= await stationsCollection.insertOne(station);
            res.send(result);
        });
        //get all stations..............
        app.get('/stations', async (req, res) => {
            const cursor = stationsCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        });
        //get one station...............
        app.get('/stations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const station = await stationsCollection.findOne(query);
            res.json(station);
        });
        //update station.................
        app.put('/stations/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateStation = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    img: updateStation.img,
                    name: updateStation.name,
                    price: updateStation.price,
                    
                },
            };
            const result = await stationsCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        //delete one station..............
        app.delete('/stations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await stationsCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Radio widget server running!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
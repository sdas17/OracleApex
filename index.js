

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const { MongoClient } = require('mongodb');
const IP_ADDRESS = '172.17.15.58';
app.use(cors());
app.use(express.json());
require('dotenv').config();
const uri = process.env.DB_PASSWORD;

const client = new MongoClient(uri);
    async function connectMongo() {
        try {
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }
    }
    
    connectMongo();

    app.use((req, res, next) => {
        req.db = client.db('sample_mflix');
        next();
    });
    
     const authenticateToken = (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token || token !== 'Bearer my_secret_token') {
        return res.sendStatus(401);
        }
        next();
        };


    app.get('/api/data', authenticateToken,async (req, res) => {
        try {
            const collection = req.db.collection('comments');
            const results = await collection.find({}).toArray();
            res.json({ data: results });
        } catch (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    app.listen(PORT,IP_ADDRESS, () => {
        console.log(`Server running on port ${PORT}`);
    });
 
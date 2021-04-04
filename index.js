const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9uab6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("error",err);
  const productCollection = client.db("buyBuyBuyers").collection("products");
  const orderCollection = client.db("buyBuyBuyers").collection("orders")
  console.log("success");
      
    app.get('/products',(req , res)=>{
        productCollection.find()
        .toArray((err , items) =>{
            res.send(items)
            console.log('from database', items);
        })
    })
    app.get('/products/:_id',(req,res)=>{
        productCollection.find({_id :ObjectId(req.params._id)})
        .toArray((err, items)=>{
            res.send(items)
            console.log('error',err , 'res',items)
        })
            
    })
  app.post('/admin' , (req , res)=>{
      const newProduct = req.body;
      console.log('adding product' , newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted count' , result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })
  app.post('/order', (req , res) => {
      const newOrder = req.body;
      orderCollection.insertOne(newOrder)
      .then(result => {
          console.log('inserted order', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })
  app.get('/productorders', (req, res) => {
     orderCollection.find()
     .toArray((err , items) => {
         console.log(err);
         res.send(items)
         console.log('from order collection', items);
     })
  })

//   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
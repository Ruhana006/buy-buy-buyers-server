const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
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
  console.log("success");


  app.post('/admin',(req,res)=>{
      const newProduct = req.body;
      console.log("adding",newProduct);
      productCollection.insertOne(newProduct)
      .then(result => {
          console.log('inserted',result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })
//   client.close();
});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
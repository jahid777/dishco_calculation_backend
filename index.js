const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// const MongoClient = require("mongodb").MongoClient;
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// mongodb config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiuhaqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const foodCollection = client.db("dishcoTest").collection("food");
  const orderCollection = client.db("dishcoTest").collection("order");

  //data adding
  app.post("/addFood", async (req, res) => {
    const food = req.body;
    const info = await foodCollection.insertOne(food).then((result) => {
      res.send(result);
    });
  });

  //get all food
  app.get("/getAllProducts", async (req, res) => {
    const foods = await foodCollection.find({}).toArray((error, documents) => {
      res.send(documents);
    });
  });

  //get food according to the food id
  app.get("/getSingleFood", (req, res) => {
    const itemId = req.query.singleFoodId;
    foodCollection.find({ _id: ObjectId(itemId) }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //cashon payment
  //cashon delivery system
  app.post("/cashonDeliveryInit", async (req, res) => {
    const data = {
      total_amount: req.body?.total_amount,
      currency: "BDT",
      success_url: `${process.env.REACT_APP_BACKEND_URL}/success`,
      fail_url: `${process.env.REACT_APP_BACKEND_URL}/fail`,
      cancel_url: `${process.env.REACT_APP_BACKEND_URL}/cancel`,
      ipn_url: `${process.env.REACT_APP_BACKEND_URL}/ipn`,
      orderedData: req.body?.orderedData,
      discountPrice: req.body?.discountPrice,
      cus_name: req.body?.cus_name,
      cus_email: req.body?.cus_email,
      cus_add1: req.body?.cus_add1,
      cus_city: req.body?.cus_city,
      cus_country: "Bangladesh",
      cus_phone: req.body?.cus_phone,
      extra_information: req.body?.extra_information,
      ship_name: req.body?.cus_name,
      ship_city: req.body?.cus_city,
      payment_status: "successful",
      product_status: req.body?.product_status,
      payment_method: req.body?.payment_method,
      orderTime: req.body?.orderTime,
    };

    //insert order data into database
    const order = await orderCollection.insertOne(data);

    //send response indicating successful insertion
    res
      .status(200)
      .send({ message: "Order data has been successfully inserted" });
  });

  // mongodb connected message
  console.log("database connected");
});

// root url route
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("app listening");
});

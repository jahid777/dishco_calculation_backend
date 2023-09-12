//ata oi bhai  kore disilo ektu prbelm dekahisiolo

// const { MongoClient, ObjectId } = require("mongodb");
// require("dotenv").config();

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiuhaqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// exports.priceByOrderId = async (orderId) => {
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const ordersCollection = client.db("dishcoTest").collection("order");
//     const order = await ordersCollection.findOne({ _id: ObjectId(orderId) });
//     if (!order) {
//       throw new Error("Order not found.");
//     }
//     let totalPrice = 0;
//     for (const orderedItem of order.orderedData) {
//       const foodCollection = client.db("dishcoTest").collection("food");
//       const foodItem = await foodCollection.findOne({
//         _id: ObjectId(orderedItem.id),
//       });
//       if (foodItem) {
//         let itemPrice = 0;

//         let priceOnSized = foodItem.sizePriceItem.find(
//           (dbprice) => dbprice.size === orderedItem.size
//         );
//         if (priceOnSized.price) {
//           itemPrice += parseFloat(priceOnSized.price);
//         }
//         for (const extras of orderedItem.extras) {
//           const dbAddon = foodItem.addonsItem.find(
//             (dbAddon) => dbAddon.addonName === extras.nameOfAddon
//           );
//           if (dbAddon) {
//             totalPrice += parseFloat(dbAddon.addonPrice);
//           }
//         }
//         itemPrice *= orderedItem.quantity;
//         totalPrice += itemPrice;
//       }
//     }

//     return totalPrice;
//   } finally {
//     client.close();
//   }
// };

// exports.price = async (orderedData) => {
//   const client = new MongoClient(uri);

//   try {
//     const userData = orderedData;
//     let totalPrice = 0;
//     for (const orderedItem of userData) {
//       const foodCollection = client.db("dishcoTest").collection("food");
//       const foodItem = await foodCollection.findOne({
//         _id: ObjectId(orderedItem.id),
//       });
//       if (foodItem) {
//         let itemPrice = 0;

//         let priceOnSized = foodItem.sizePriceItem.find(
//           (dbprice) => dbprice.size === orderedItem.size
//         );
//         if (priceOnSized.price) {
//           itemPrice += parseFloat(priceOnSized.price);
//         }
//         for (const extras of orderedItem.extras) {
//           const dbAddon = foodItem.addonsItem.find(
//             (dbAddon) => dbAddon.addonName === extras.nameOfAddon
//           );
//           if (dbAddon) {
//             totalPrice += parseFloat(dbAddon.addonPrice);
//           }
//         }
//         itemPrice *= orderedItem.quantity;
//         totalPrice += itemPrice;
//       }
//     }
//     return totalPrice;
//   } finally {
//     client.close();
//   }
// };

//ata ami korsilam solve kore valoi kaj kore tobe atar mongodb connection kinto alada alada kore korsi

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { connectToDatabase } = require("./db");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiuhaqv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

exports.priceByOrderId = async (orderId) => {
  const db = await connectToDatabase();
  try {
    const orderCollection = db.collection("Orders");
    const order = await orderCollection.findOne({ _id: ObjectId(orderId) });
    if (!order) {
      throw new Error("Order not found.");
    }
    let totalPrice = 0;
    for (const orderedItem of order.orderedData) {
      const db = await connectToDatabase();
      const foodCollection = db.collection("foodCollection");
      const foodItem = await foodCollection.findOne({
        _id: ObjectId(orderedItem.id),
      });
      if (foodItem) {
        let itemPrice = 0;

        let priceOnSized = foodItem.sizePriceItem.find(
          (dbprice) => dbprice.size === orderedItem.size
        );
        if (priceOnSized.price) {
          itemPrice += parseFloat(priceOnSized.price);
        }
        for (const extras of orderedItem.extras) {
          const dbAddon = foodItem.addonsItem.find(
            (dbAddon) => dbAddon.addonName === extras.nameOfAddon
          );
          if (dbAddon) {
            totalPrice += parseFloat(dbAddon.addonPrice);
          }
        }
        itemPrice *= orderedItem.quantity;
        totalPrice += itemPrice;
      }
    }

    return totalPrice;
  } finally {
    // db.close();
  }
};

exports.price = async (orderedData) => {
  const db = await connectToDatabase();

  try {
    const userData = orderedData;
    let totalPrice = 0;
    for (const orderedItem of userData) {
      const foodCollection = db.collection("foodCollection");

      const foodItem = await foodCollection.findOne({
        _id: ObjectId(orderedItem.id),
      });
      if (foodItem) {
        let itemPrice = 0;

        let priceOnSized = foodItem.sizePriceItem.find(
          (dbprice) => dbprice.size === orderedItem.size
        );
        if (priceOnSized.price) {
          itemPrice += parseFloat(priceOnSized.price);
        }
        for (const extras of orderedItem.extras) {
          const dbAddon = foodItem.addonsItem.find(
            (dbAddon) => dbAddon.addonName === extras.nameOfAddon
          );
          if (dbAddon) {
            totalPrice += parseFloat(dbAddon.addonPrice);
          }
        }
        itemPrice *= orderedItem.quantity;
        totalPrice += itemPrice;
      }
    }
    return totalPrice;
  } finally {
    // db.close();
  }
};


const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection URI
const client = new MongoClient(uri);

exports.priceByOrderId = async (orderId) => {
    try {
        await client.connect();
        const ordersCollection = client.db('dishcoTest').collection('order');
        const order = await ordersCollection.findOne({ _id: ObjectId(orderId) });
        if (!order) {
            throw new Error('Order not found.');
        }
        let totalPrice = 0;
        for (const orderedItem of order.orderedData) {
            const foodCollection = client.db('dishcoTest').collection('food');
            const foodItem = await foodCollection.findOne({ _id: ObjectId(orderedItem.id) });
            if (foodItem) {
                let itemPrice = 0;

                let priceOnSized = foodItem.sizePriceItem.find(dbprice => dbprice.size === orderedItem.size);
                if (priceOnSized.price) {
                    itemPrice += parseFloat(priceOnSized.price);
                }
                for (const extras of orderedItem.extras) {
                    const dbAddon = foodItem.addonsItem.find(dbAddon => dbAddon.addonName === extras.nameOfAddon);
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
        client.close();
    }
}

exports.price = async (orderedData) => {
    try {
        const userData = (orderedData);
        let totalPrice = 0;
        for (const orderedItem of userData) {
            const foodCollection = client.db('dishcoTest').collection('food');
            const foodItem = await foodCollection.findOne({ _id: ObjectId(orderedItem.id) });
            if (foodItem) {
                let itemPrice = 0;

                let priceOnSized = foodItem.sizePriceItem.find(dbprice => dbprice.size === orderedItem.size);
                if (priceOnSized.price) {
                    itemPrice += parseFloat(priceOnSized.price);
                }
                for (const extras of orderedItem.extras) {
                    const dbAddon = foodItem.addonsItem.find(dbAddon => dbAddon.addonName === extras.nameOfAddon);
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
        client.close();
    }
}

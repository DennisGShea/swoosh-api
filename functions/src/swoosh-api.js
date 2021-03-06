const admin = require("firebase-admin");

const serviceAccount = require("../swish-api-credentials.json");

let db;

function dbAuth() {
  if (!db) {
    admin.initializeApp({
      credentials: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
  }
}

exports.getItem = (req, res) => {
  //  if(!req.params.userId) {
  //         res.status(400).send('Invalid request')
  //     }
  dbAuth();
  db.collection("routes") //.where('userId', '==', req.params.userId)
    .get()
    .then((collection) => {
      const itemList = collection.docs.map((doc) => {
        let item = doc.data();
        item.id = doc.id;
        console.log(item);
        return item;
      });
      res.status(200).send(itemList);
    })
    .catch((err) => res.status(500).send("get items failed:", err));
};
exports.postItem = (req, res) => {
  console.log("res.body here", req.body);
  // if (!req.body || !req.body || req.body.userId) {
  //   res.status(400).send("Invalid Post");
  // }
  dbAuth();

  //26.386414056565638, -80.12463575823134 - lynn univ boca
  //  26.439070585781987, -80.12391161756315  Mr Chen’s Hunan Palace
  //  26.43907, -80.12391

  //  let newItem = {
  //     start:  {
  //               lat: 26.43907,
  //               lng: -80.12391
  //             },
  //     stop:   {
  //               lat: 26.3864140,
  //               // lng: -80.124635
  //               lng: -80.7777777777
  //             },
  //     userId: "oierg340n5g5"
  //   }

  db.collection("routes")
    .add(req.body)
    .then(() => {
      this.getItem(req, res);
      // console.log(req.body);
      // console.log("req and res",req,res);
    })
    .catch((err) => res.status(500).send("post failed", err));
};

exports.patchItem = (req, res) => {
  if (!req.body || !req.body.duration || !req.params.itemId) {
    //|| !req.params.userId
    res, status(400).send("invalid request");
  }
  authDB();
  let now = admin.firestore.FieldValue.serverTimestamp();
  db.collection("routes")
    .doc(req.params.itemId)
    .update({
      updated: now,
      logs: admin.firestore.FieldValue.arrayUnion(req.body),
      totalDuration: admin.firestore.FieldValue.increment(
        Number(req.body.duration)
      ),
    })
    .then(() => {
      this.getItems(req, res);
    })
    .catch((err) => res.status(500).send("error updating item:" + err));
};

exports.deleteItem = (req, res) => {
  if (!req.params.userId || !req.params.itemId) {
    res.status(400).send("Invalid Request");
  }
  dbAuth();
  db.collection("routes")
    .doc(req.params.itemId)
    .delete()
    .then(() => this.getItems(req, res))
    .catch((err) => res.status(500).send("delete failed:", err));
};

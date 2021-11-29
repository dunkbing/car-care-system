import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as serviceKey from '../config/google-services.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceKey as any),
});

const app = express();
app.use(express.json());
app.use(cors({origin: true}));

app.post('/rescues', async (req, res) => {
  const {garageId, description} = req.body;
  const db = admin.firestore();
  const docRef = db.collection('garage-device-tokens').doc(`${garageId}`);
  const data = await docRef.get();

  if (data.exists) {
    const tokens = data.data()?.tokens || [];
    console.log(tokens);
    for (const token of tokens) {
      admin.messaging().sendToDevice(token, {
        notification: {
          title: 'Yêu cầu mới',
          body: description,
        },
        data: {
          type: 'rescue',
        },
      });
    }
  }
  res.status(200).send({
    message: 'success',
  });
});

export const api = functions.https.onRequest(app);
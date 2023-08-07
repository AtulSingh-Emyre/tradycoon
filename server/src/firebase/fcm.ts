import * as admin from 'firebase-admin';

// var firebaseConfig = {
//   apiKey: 'AIzaSyDOCAbC123dEf456GhI789jKl01-MnO',
//   authDomain: 'myapp-project-123.firebaseapp.com',
//   databaseURL: 'https://myapp-project-123.firebaseio.com',
//   projectId: 'tradycoon-3fb5c',
//   storageBucket: 'myapp-project-123.appspot.com',
//   messagingSenderId: '982446765859',
//   appId: '1:982446765859:android:319e96bd63938e41fa3e96',
//   measurementId: 'G-8GSGZQ44ST',
// };
// admin.initializeApp(firebaseConfig);

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'tradycoon-3fb5c',
    clientEmail: 'firebase-adminsdk-awph0@tradycoon-3fb5c.iam.gserviceaccount.com',
    privateKey:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCScF6quSW4DmIn\n+YL2a9E6jjEBxXOQXOvL9mjeQ2nrr2PyZ9zJ7ynTq/f4eChSq93qe9hRsPh86AdU\n8TMEJgPn6ZMHNKH3qWAPCquP/30VBQxvnoVdl9gftzPmqilysAvDc1A2tntf0Ev5\nmKAeFkSuEJdREsKZqzq1rGH/m2Rr03uVEOVNabF3iy1A4PzlPh9BTCiw6Mv6sbpc\nEyMMuyZ91EHeYAfxjMfoH6OYbe4lxhE0YPOLNjuaMbvaUpAHTOJ9u7isqMUU7Tvb\nZS/s27Kqq8DBUjPT+xyFvyYlDNxo+MDjZ+slFaTbEzIfcM5vQFzWoQJdH2fjGMlE\nRVrwlnvRAgMBAAECggEAC12eh1x76uNuPGE0st4O558k0Bj3Es/CJbrlYZzfXMwo\niHuwYARInYsbIa/nx0owx5Pe/VuBidDzeA+0GzYSdwlCtgbggaml0Oe4haJkNFcH\njlFCKM+8gJ0A8aioM2R/tpGIZVq39tQ4AAfCeQYBmiCjsfFFZSpsUdtENukku+vt\nwnQciyE1dBx7LNQSXilaXOkNFeSnCvtwmzLI4M69JB+EIaKh2DXCpekMujW+folF\nyXzQ7ITAKlX2FTErwedfSePC2FmhPgfJKxZuAO3ApByslWyre0ZckEsNTQJqkwE1\nYQ75td0ZbYEQZY9rPmfXJ/sFE6Sdsd4J4tY9qOdATQKBgQDOg4CY2sqgvqfXLdXG\n3z0nPMLKtYm1aaUH9voiF6AqnnhRVW+wHgnEvzvJPt0rEO/fq6XKJJqBlvHSa1nr\nPkpG0z43cVBOiHkEtVa7q8NsB7KU00QXwyheH0u7/UjEHqCJrXvXYqw8jTtjgvim\n34foQWl1bbZwo9jK573jqFu03QKBgQC1h5tyT91/b+ksKQzR7vvyg7RGy76ZGWyC\naqGC/kJhjjjCf2nakzDd25RqQmyYTgrkYUoS6p+rC0Q4EojQ/JLV6pkMPv3O9qmU\nKo9kHljOXND7nA6o2qGsWG/ad/hj7gC1a8fthJN1gG+lCsG4L1dpHOB/A+8xDv1w\nLm4moLDJhQKBgAUtYMz0Nz4+aWDIomJg+FyCdnO0h2ZH5r5DX9P4+af33xZS6QDm\nT+Jh1PLfo5XPz+OwnvBpaII1MYzP6iounpgV9apYKeY+H6KRlUIRNU4BB2YZwcxC\ntUFe0Xw+BlP8XJP3CHLG44CFHecJwogUdIjLEwTBomBCi03S73zEnL/1AoGAZL8C\nEosojtV5Pzz5FHnh8lIN90yUVzu48Rhk0uJxzNq1vZwhD2GpOTfoQqDizBRkDyO/\njIgSXUc/cS84J2RFydsNXbKIAhj7PHPyaMo+1yjEAyA1MplEKPZb/Y+flzY7xnQu\n3S8693d0ftBdeu8rP/b60QNJ+JwtI9lg4KdF9lECgYEAsuNEEG8jvHKx2toUKs/J\nUOeVYK1Nv77PqzKptS8mHq0q/Y0WXcZikn93cWTHStAnSHDnLmT0iSfjipebIptS\nSGESaLUIv72/NworZUhvWRNyqXId05ikgSa7Xzebs6mP8Q/SBZl1SXU78RtaBZfj\njcPqy6XzHEM5JkNrtWVW+wo=\n-----END PRIVATE KEY-----\n',
  }),
  databaseURL: 'https://tradycoon-3fb5c-default-rtdb.firebaseio.com',
});

export enum NotificationTopic {
  FREE_SIGNAL = 'freesignal',
  APPROVE = 'approve',
}

export const sendNotification = async (
  tokens: [string],
  messageTitle?: string,
  messageBody?: string,
  custom?: any,
  type?: string,
) => {
  try {
    const results = await admin.messaging().sendMulticast({
      tokens: tokens || [],
      notification: {
        title: messageTitle || '',
        body: messageBody || '',
      },
      android: {
        priority: 'high',
      },
    });
    return results;
  } catch (error) {}
};

export const sendNotificationAll = async (
  messageTitle?: string,
  messageBody?: string,
  topic?: string,
  type?: string,
) => {
  const message = {
    notification: {
      title: messageTitle,
      body: messageBody,
    },
    topic: NotificationTopic.FREE_SIGNAL,
  };
  if (process.env.NODE_ENV === 'production') {
    const response = await admin
      .messaging()
      .send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
};

export const subscribeToTopic = async (registrationTokens: string | string[], topic: string) => {
  console.log('Request for subscribeToTopic');
  await admin
    .messaging()
    .subscribeToTopic(registrationTokens, topic)
    .then((response) => {
      console.log('Successfully subscribed to topic:', response);
    })
    .catch((error) => {
      console.log('Error subscribing to topic:', error);
    });
};

export const unsubscribeFromTopic = async (
  registrationTokens: string | string[],
  topic: string,
) => {
  await admin
    .messaging()
    .unsubscribeFromTopic(registrationTokens, topic)
    .then((response) => {
      console.log('Successfully unsubscribed from topic:', response);
    })
    .catch((error) => {
      console.log('Error unsubscribing from topic:', error);
    });
};

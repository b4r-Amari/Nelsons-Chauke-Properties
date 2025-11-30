
import { Firestore, Timestamp } from '@google-cloud/firestore';

const db = new Firestore({
    projectId: process.env.GCLOUD_PROJECT || 'nc-properties-redefined',
});

export { db as adminDb, Timestamp };

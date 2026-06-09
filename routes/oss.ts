import express, {type Response, type NextFunction} from 'express';
import {BucketsApi, ObjectsApi} from 'forge-apis';
import type {ForgeConfig, ForgeRequest, ForgeCredentials} from '../types/forge';

const { getClient, getInternalToken } = require('./common/oauth') as {
    getClient: (scopes?: string[]) => unknown;
    getInternalToken: () => Promise<ForgeCredentials>;
};
const config: ForgeConfig = require('../config');

const router = express.Router();

// Middleware for obtaining a token for each request.
router.use(async (req: ForgeRequest, res: Response, next: NextFunction) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient() as ForgeRequest['oauth_client'];
    next();
});

// GET /api/forge/oss/buckets - expects a query param 'id'; if the param is '#' or empty,
// returns a JSON with list of buckets, otherwise returns a JSON with list of objects in bucket with given name.
router.get('/buckets', async (req: ForgeRequest, res: Response, next: NextFunction) => {
    const bucketName = typeof req.query.id === 'string' ? req.query.id : undefined;
    if (!bucketName || bucketName === '#') {
        try {
            // Retrieve buckets from Forge using the [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#getBuckets)
            const buckets = await new BucketsApi().getBuckets({ region: 'EMEA', limit: 64 }, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket: {bucketKey: string}) => {
                return {
                    id: bucket.bucketKey,
                    // Remove bucket key prefix that was added during bucket creation
                    text: bucket.bucketKey.replace(`${config.credentials.client_id}`.toLowerCase() + '-', ''),
                    type: 'bucket',
                    children: true
                };
            }));
        } catch(err) {
            next(err);
        }
    } else {
        try {
            // Retrieve objects from Forge using the [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
            const objects = await new ObjectsApi().getObjects(bucketName, {}, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object: {objectId: string; objectKey: string}) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch(err) {
            next(err);
        }
    }
});

module.exports = router;

import express, {type Request, type Response, type NextFunction} from 'express';
import type {ForgeCredentials} from '../types/forge';

const { getPublicToken } = require('./common/oauth') as {
    getPublicToken: () => Promise<ForgeCredentials>;
};

const router = express.Router();

// GET /api/forge/oauth/token - generates a public access token (required by the Forge viewer).
router.get('/token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = await getPublicToken();
        res.json({
            access_token: token.access_token,
            expires_in: token.expires_in
        });
    } catch(err) {
        next(err);
    }
});

module.exports = router;

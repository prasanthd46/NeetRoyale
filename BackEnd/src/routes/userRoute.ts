import express, { Request, Response } from 'express';
import { upsertUser } from '../controllers/userController';
import { checkJwt } from '../auth/auth';

const router = express.Router();

router.post('/usersave', checkJwt, async (req: Request, res: Response): Promise<void> => {
  const { username, email } = req.body;
  if (!username || !email) {
    res.status(400).json({ error: 'Missing username or email' });
    return;
  }

  try {
    const user = await upsertUser({ username, email });
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upsert user' });
  }
});

export default router;

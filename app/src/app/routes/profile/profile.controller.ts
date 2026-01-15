import { NextFunction, Request, Response, Router } from 'express';
// CORRECTION IMPORT
import { required as authRequired, optional as authOptional } from '../auth/auth';
import { followUser, getProfile, unfollowUser } from './profile.service';

const router = Router();

router.get(
  '/profiles/:username',
  authOptional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await getProfile(req.params.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/profiles/:username/follow',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await followUser(req.params?.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/profiles/:username/follow',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await unfollowUser(req.params.username, req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
import { NextFunction, Request, Response, Router } from 'express';
// CORRECTION IMPORT
import { required as authRequired, optional as authOptional } from '../auth/auth';
import {
  addComment,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticle,
  getArticles,
  getCommentsByArticle,
  getFeed,
  unfavoriteArticle,
  updateArticle,
} from './article.service';

const router = Router();

router.get('/articles', authOptional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getArticles(req.query, req.auth?.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/articles/feed',
  authRequired, // CORRECTION
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getFeed(
        Number(req.query.offset),
        Number(req.query.limit),
        req.auth?.user?.id,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/articles', authRequired, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await createArticle(req.body.article, req.auth?.user?.id);
    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/articles/:slug',
  authOptional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await getArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/articles/:slug',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await updateArticle(req.body.article, req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/articles/:slug',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteArticle(req.params.slug, req.auth?.user!.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/articles/:slug/comments',
  authOptional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await getCommentsByArticle(req.params.slug, req.auth?.user?.id);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/articles/:slug/comments',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await addComment(req.body.comment.body, req.params.slug, req.auth?.user?.id);
      res.json({ comment });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/articles/:slug/comments/:id',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteComment(Number(req.params.id), req.auth?.user?.id);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/articles/:slug/favorite',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await favoriteArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/articles/:slug/favorite',
  authRequired,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await unfavoriteArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
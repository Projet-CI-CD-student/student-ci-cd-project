import { Router } from 'express';
import tagsController from './tag/tag.controller';
import articlesController from './article/article.controller';
import authController from './auth/auth.controller';
import profileController from './profile/profile.controller';

// --- FIX : Fonction de sécurité pour l'import ---
// Cette fonction vérifie si le contrôleur est caché dans une propriété ".default"
// (ce qui arrive souvent après le build de production) ou s'il est accessible directement.
const safeMount = (controller: any) => {
  return controller.default ? controller.default : controller;
};

const api = Router()
  .use(safeMount(tagsController))
  .use(safeMount(articlesController))
  .use(safeMount(profileController))
  .use(safeMount(authController));

export default Router().use('/api', api);
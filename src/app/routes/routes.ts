import { Router } from 'express';
import articlesController from './article/article.controller';
import authController from './auth/auth.controller';
import profileController from './profile/profile.controller';

const api = Router()
  .use(articlesController)
  .use(profileController)
  .use(authController);

export default Router().use('/api', api);

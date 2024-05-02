import prisma from '../../prisma/prisma-client';
import {
  deleteComment,
  favoriteArticle,
  unfavoriteArticle,
} from '../../app/routes/article/article.service';

describe('ArticleService', () => {
  beforeEach(async () => {
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('deleteComment', () => {
    test('should throw an error when no record exists', () => {
      // Given
      const id = 123;
      const idUser = 456;

      // Then
      expect(deleteComment(id, idUser)).rejects.toThrowError();
    });
  });

  describe('favoriteArticle', () => {
    test('should return the favorited article', async () => {
      // Given
      const userId = 123;
      const slug = 'How-to-train-your-dragon';

      // When
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
          bio: null,
        },
      });
      await prisma.article.create({
        data: {
          slug: 'How-to-train-your-dragon',
          title: 'How to train your dragon',
          description: '',
          body: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: userId,
        },
      });

      // Then
      const article = await favoriteArticle(slug, userId);
      expect(article.favoritesCount).toEqual(1);
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const id = 123;
      const slug = 'how-to-train-your-dragon';

      // Then
      await expect(favoriteArticle(slug, id)).rejects.toThrowError();
    });
  });
  describe('unfavoriteArticle', () => {
    test('should return the unfavorited article', async () => {
      // Given
      const userId = 123;
      const slug = 'How-to-train-your-dragon';

      // When
      await prisma.user.create({
        data: {
          id: userId,
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
          bio: null,
        },
      });
      await prisma.article.create({
        data: {
          slug: slug,
          title: 'How to train your dragon',
          description: '',
          body: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: userId,
        },
      });
      await prisma.article.update({
        where: {
          slug,
        },
        data: {
          favoritedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // Then
      const article = await unfavoriteArticle(slug, userId);
      expect(article.favoritesCount).toEqual(0);
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const id = 123;
      const slug = 'how-to-train-your-dragon';

      // Then
      await expect(unfavoriteArticle(slug, id)).rejects.toThrowError();
    });
  });
});

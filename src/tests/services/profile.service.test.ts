import prisma from '../../prisma/prisma-client';
import {
  followUser,
  getProfile,
  unfollowUser,
} from '../../app/routes/profile/profile.service';

describe('ProfileService', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('getProfile', () => {
    test('should return a following property', async () => {
      // Given
      const username = 'user_1';
      const id = 123;

      // When
      await prisma.user.create({
        data: {
          id: 123,
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
          bio: null,
        },
      });

      // Then
      await expect(getProfile(username, id)).resolves.toHaveProperty(
        'following'
      );
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const username = 'user_1';
      const id = 123;

      // Then
      await expect(getProfile(username, id)).rejects.toThrowError();
    });
  });

  describe('followUser', () => {
    test('should return a following property', async () => {
      // Given
      const userId = 123;
      const usernamePayload = 'user_2';

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
      await prisma.user.create({
        data: {
          username: usernamePayload,
          email: 'user2@me',
          password: '1234',
          bio: null,
        },
      });

      // Then
      await expect(followUser('user_2', userId)).resolves.toHaveProperty(
        'following'
      );
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const usernamePayload = 'AnotherUser';
      const id = 123;

      // Then
      await expect(followUser(usernamePayload, id)).rejects.toThrowError();
    });
  });

  describe('unfollowUser', () => {
    test('should return a following property', async () => {
      // Given
      const userId = 123;
      const usernamePayload = 'user_2';

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
      await prisma.user.create({
        data: {
          username: usernamePayload,
          email: 'user2@me',
          password: '1234',
          bio: null,
        },
      });
      await prisma.user.update({
        where: {
          username: usernamePayload,
        },
        data: {
          followedBy: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // Then
      await expect(
        unfollowUser(usernamePayload, userId)
      ).resolves.toHaveProperty('following');
    });

    test('should throw an error if no user is found', async () => {
      // Given
      const userId = 123;
      const usernamePayload = 'user_2';

      // Then
      await expect(
        unfollowUser(usernamePayload, userId)
      ).rejects.toThrowError();
    });
  });
});

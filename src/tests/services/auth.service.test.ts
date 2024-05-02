import prisma from '../../prisma/prisma-client';
import * as bcrypt from 'bcryptjs';
import {
  createUser,
  getCurrentUser,
  login,
  updateUser,
} from '../../app/routes/auth/auth.service';

describe('AuthService', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  describe('createUser', () => {
    test('should create new user ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'user_1',
        email: 'user1@me',
        password: '1234',
      };

      // Then
      const createdUser = await createUser(user);
      await expect(createdUser).toHaveProperty('token');
    });

    test('should throw an error when creating new user with empty username', async () => {
      // Given
      const user = {
        id: 123,
        username: ' ',
        email: 'user1@me',
        password: '1234',
      };

      // Then
      const error = String({ errors: { username: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty email ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'user_1',
        email: '  ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an error when creating new user with empty password ', async () => {
      // Given
      const user = {
        id: 123,
        username: 'user_1',
        email: 'user1@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(createUser(user)).rejects.toThrow(error);
    });

    test('should throw an exception when creating a new user with already existing user on same username ', async () => {
      // Given
      const user = {
        username: 'user_1',
        email: 'user1@me',
        password: '1234',
      };

      // When
      await prisma.user.create({
        data: {
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
        },
      });

      // Then
      const error = { email: ['has already been taken'] }.toString();
      await expect(createUser(user)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    test('should return a token', async () => {
      // Given
      const user = {
        email: 'user1@me',
        username: 'user_1',
        password: await bcrypt.hash('1234', 10),
      };

      // When
      await prisma.user.create({
        data: user,
      });

      // Then
      await expect(
        login({ email: 'user1@me', password: '1234' })
      ).resolves.toHaveProperty('token');
    });

    test('should throw an error when the email is empty', async () => {
      // Given
      const user = {
        email: ' ',
        password: '1234',
      };

      // Then
      const error = String({ errors: { email: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when the password is empty', async () => {
      // Given
      const user = {
        email: 'user1@me',
        password: ' ',
      };

      // Then
      const error = String({ errors: { password: ["can't be blank"] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error when no user is found', async () => {
      // Given
      const user = {
        email: 'user1@me',
        password: '1234',
      };

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(login(user)).rejects.toThrow(error);
    });

    test('should throw an error if the password is wrong', async () => {
      // Given
      const user = {
        email: 'user1@me',
        username: 'user_1',
        password: await bcrypt.hash('1234', 10),
      };

      // When
      await prisma.user.create({
        data: user,
      });

      // Then
      const error = String({ errors: { 'email or password': ['is invalid'] } });
      await expect(
        login({ email: 'user1@me', password: '4321' })
      ).rejects.toThrow(error);
    });
  });

  describe('getCurrentUser', () => {
    test('should return a token', async () => {
      // Given
      const id = 123;

      // When
      await prisma.user.create({
        data: {
          id,
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
          bio: null,
        },
      });

      // Then
      await expect(getCurrentUser(id)).resolves.toHaveProperty('token');
    });
  });

  describe('updateUser', () => {
    test('should return a token', async () => {
      // Given
      const id = 123;
      const user = {
        username: 'user_1',
        email: 'user1@me',
        password: '1234',
      };

      // When
      await prisma.user.create({
        data: {
          id,
          username: 'user_1',
          email: 'user1@me',
          password: '1234',
          bio: null,
        },
      });

      // Then
      await expect(updateUser(user, id)).resolves.toHaveProperty('token');
    });
  });
});

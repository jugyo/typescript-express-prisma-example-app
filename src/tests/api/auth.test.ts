import request from 'supertest';
import app from '../../main';
import prisma from '../../prisma/prisma-client';

describe('POST /api/users', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  it('should create a user', async () => {
    // Given: no user

    // When
    const res = await request(app)
      .post('/api/users')
      .send({
        user: {
          email: 'user1@me',
          username: 'user_1',
          password: 'password',
        },
      });

    // Then
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('token');
  });

  it('should return an error when creating new user with empty username', async () => {
    // Given: no user

    // When
    const res = await request(app)
      .post('/api/users')
      .send({
        user: {
          email: 'user1@me',
          username: ' ',
          password: 'password',
        },
      });

    // Then
    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('username');
  });

  it('should return an error when creating new user with empty email', async () => {
    // Given: no user

    // When
    const res = await request(app)
      .post('/api/users')
      .send({
        user: {
          email: ' ',
          username: 'user_1',
          password: 'password',
        },
      });

    // Then
    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('email');
  });

  it('should return an error when creating new user with empty password', async () => {
    // Given: no user

    // When
    const res = await request(app)
      .post('/api/users')
      .send({
        user: {
          email: 'user1@me',
          username: 'user_1',
          password: ' ',
        },
      });

    // Then
    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('password');
  });
});

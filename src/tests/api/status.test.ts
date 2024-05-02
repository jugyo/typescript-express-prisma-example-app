import request from 'supertest';
import app from '../../main';

describe('GET /', () => {
  it('should return 200 OK', async () => {
    // When
    const response = await request(app).get('/');

    // Then
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'API is running on /api' });
  });
});

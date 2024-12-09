// tests/register.test.js (test jednostkowy dla rejestracji)
import request from 'supertest'; // Używamy supertest do symulowania żądań HTTP
import app from '../server/app'; // Aplikacja Express, którą testujemy

describe('POST /api/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'newuser',
        password: 'password123',
        email: 'newuser@example.com'
      });
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe('User Register Successfully');
  });

  it('should return error if username already exists', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'existinguser',
        password: 'password123',
        email: 'existinguser@example.com'
      });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Please use unique username');
  });
});

import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import httpStatus from 'http-status';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import jwt from 'jsonwebtoken';
import { TicketStatus } from '@prisma/client';

beforeAll(async () => await init());

beforeEach(async () => await cleanDb());

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const result = await server.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const result = await server.get('/hotels').set('Authorization', `Bearer Token`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if user has not yet enrollment', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 if user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 if hotel does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 if ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false);

      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(result.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const result = await server.get('/hotels');

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const result = await server.get('/hotels').set('Authorization', `Bearer Token`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const result = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(result.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

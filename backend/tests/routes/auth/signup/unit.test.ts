import supertest from 'supertest';
import { User } from '@/models/user.model';
import { server as app } from '@/server';


describe('POST /api/auth/signup', () => {
    it('should return 201 and a new user object', async () => { 
        const endpoint = '/api/auth/signup';
        const request = supertest(app);

        const email = "example@example.com"

        beforeEach(() => {
            // mock user find by email
        })
        //test with empty body
        it('should return 400 if request body is empty', async () => {
            const response = await request.post(endpoint).send({});
            expect(response.status).toBe(400);
        })
    });
});
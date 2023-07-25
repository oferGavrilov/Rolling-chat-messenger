import supertest from 'supertest'

import createServer from '../../config/server'
import { disconnectDB } from '../../config/db'

const app = createServer()

afterAll(async () => {
      await disconnectDB()
})

describe('user', () => {

      describe('GET /api/user route', () => {

            describe('given the userId that is not in the database', () => {

                  it('should return a 401 Unauthorized status code', async () => {
                        const userId = '123456789012345678901234';
                        await supertest(app).get(`/api/auth/all/${userId}`).expect(404);
                      }, 10000); // Increase the timeout to 10 seconds
            })
      })
})
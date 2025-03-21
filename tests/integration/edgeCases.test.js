const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
require('dotenv').config();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

describe('Rijksmuseum API Edge Case Tests', () => {
    let response;

    describe('Error Handling', () => {
        it('should return 400 for malformed request', async () => {
            response = await request(BASE_URL)
                .get('/collection')
                .query({
                    key: API_KEY,
                    format: 'json',
                    p: 'invalid_page'
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error');
        });

        it('should return 404 for non-existent endpoint', async () => {
            response = await request(BASE_URL)
                .get('/nonexistent')
                .query({
                    key: API_KEY,
                    format: 'json'
                });

            expect(response.status).to.equal(404);
        });
    });

    describe('Boundary Testing', () => {
        it('should handle pagination at the first page', async () => {
            response = await request(BASE_URL)
                .get('/collection')
                .query({
                    key: API_KEY,
                    format: 'json',
                    p: 1,
                    ps: 10
                });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('artObjects');
        });

        it('should handle pagination at a high page number', async () => {
            response = await request(BASE_URL)
                .get('/collection')
                .query({
                    key: API_KEY,
                    format: 'json',
                    p: 1000,
                    ps: 10
                });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('artObjects');
        });
    });
}); 
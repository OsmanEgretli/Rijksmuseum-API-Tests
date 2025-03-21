const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
require('dotenv').config();

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

describe('Rijksmuseum API Tests', () => {
    let response;
    let startTime;

    beforeEach(() => {
        startTime = Date.now();
    });

    afterEach(() => {
        const duration = Date.now() - startTime;
        console.log(`Test duration: ${duration}ms`);
    });

    describe('Collection Endpoints', () => {
        it('should get collection items with pagination and validate response structure', async () => {
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
            expect(response.body.artObjects).to.be.an('array');
            expect(response.body.artObjects.length).to.be.at.most(10);
            
            // Additional validation for response structure
            if (response.body.artObjects.length > 0) {
                const firstItem = response.body.artObjects[0];
                expect(firstItem).to.have.property('id');
                expect(firstItem).to.have.property('objectNumber');
                expect(firstItem).to.have.property('title');
            }
        });

        it('should get specific artwork details and validate all required fields', async () => {
            const objectNumber = 'SK-C-5'; // The Night Watch
            response = await request(BASE_URL)
                .get(`/collection/${objectNumber}`)
                .query({
                    key: API_KEY,
                    format: 'json'
                });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('artObject');
            
            const artObject = response.body.artObject;
            expect(artObject).to.have.property('objectNumber', objectNumber);
            expect(artObject).to.have.property('title');
            expect(artObject).to.have.property('principalMaker');
            expect(artObject).to.have.property('longTitle');
            expect(artObject).to.have.property('webImage');
            
            // Validate webImage structure
            if (artObject.webImage) {
                expect(artObject.webImage).to.have.property('url');
                expect(artObject.webImage).to.have.property('width');
                expect(artObject.webImage).to.have.property('height');
            }
        });

        it('should search collection with multiple parameters and validate search results', async () => {
            response = await request(BASE_URL)
                .get('/collection')
                .query({
                    key: API_KEY,
                    format: 'json',
                    q: 'Rembrandt',
                    type: 'painting',
                    p: 1,
                    ps: 20
                });

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('artObjects');
            expect(response.body.artObjects).to.be.an('array');
            
            // Validate search results
            if (response.body.artObjects.length > 0) {
                console.log(response.body.artObjects[0]);  
                const firstResult = response.body.artObjects[0];
                expect(firstResult).to.have.property('title');
                expect(firstResult).to.have.property('objectNumber');
                expect(firstResult).to.have.property('principalOrFirstMaker');
                
                // Validate search relevance
                expect(firstResult.title.toLowerCase()).to.include('self-portrait');
            }
        });

        it('should handle invalid API key and validate error response', async () => {
            response = await request(BASE_URL)
                .get('/collection')
                .query({
                    key: 'invalid_key',
                    format: 'json'
                });

            expect(response.status).to.equal(401);
            expect(response.body).to.include('Invalid key');
            
        });
    });
}); 
const request = require('supertest');
// const router = require('../routes/authenRouter')
require('dotenv').config({ path: '../.env' });
const http = require('http');
const async = require('async');
const app = require('../app');
const { ObjectId } = require('mongoose').Types;
const User = require('../model/user');
const testUsername1 = 'testUsername1';
const testUsername2 = 'testUsername2';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testPasswordCorrect = 'correctPassword';
const regData = Date.now();

let server;
let agent;

beforeAll((done) => {
    server = http.createServer(app.expressApp);
    agent = request.agent(server);
    server.listen(done);
  });
  
afterAll((done) => {
    app.mongoose.connection.close()
    .then(server.close(done));
});

describe('Tests of core app.js functionality', () => {
    test('Permits authenticated user to visit restricted page', () => {
        const req = { isAuthenticated: () => true };
        const res = {
        redirect: (string) => string,
        status: (code) => code,
        };
        res.status.json = (string) => string;
        const next = () => 'next';
        const authentication = app.checkAuthenticated(req, res, next);

        expect(authentication).toEqual('next');   
    });

    test('Prevents unauthenticated user from visiting restricted page', () => {
        const req = { isAuthenticated: () => false };
        const jsonRes = { json: (string) => string };
        const res = {
          redirect: (string) => string,
          status: () => jsonRes,
        };
        const next = () => 'next';
        const authentication = app.checkAuthenticated(req, res, next);
    
        expect(authentication).toEqual('[!] Not authorized');
    });

    test('Prevents authenticated user from visiting unrestricted page', () => {
        const req = { isAuthenticated: () => true };
        const res = {
          redirect: (string) => string,
          status: (code) => code,
        };
        res.status.json = (string) => string;
        const next = () => 'next';
        const authentication = app.checkNotAuthenticated(req, res, next);
    
        expect(authentication).toEqual(200);
    });

    test('Permits unauthenticated user to visit unrestricted page', () => {
        const req = { isAuthenticated: () => false };
        const res = {
          redirect: (string) => string,
          status: (code) => code,
        };
        res.status.json = (string) => string;
        const next = () => 'next';
        const authentication = app.checkNotAuthenticated(req, res, next);
    
        expect(authentication).toEqual('next');
    });
});

describe('When a user is not logged in', () => {
  // Register before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/Register')
        .field('email', testEmail1)
        .field('password', testPasswordCorrect)
        .field('username', testUsername1)
        .field('registrationDate', regData)
        .then(() => { requestDone(); }),
    ], done);
  });

//   test('The API is active', (done) => {
//     agent
//       .get('/testAPI')
//       .expect(200)
//       .then(() => { done(); });
//   });

  test('They are not authorized', (done) => {
    agent
      .get('/checkAuthen')
      .expect(401)
      .then(() => { done(); });
  });

//   test('They cannot register an account with a duplicate email address', (done) => {
//     agent
//       .post('/Register')
//       .field('email', testEmail1)
//       .field('password', testPasswordCorrect)
//       .field('username', testUsername2)
//       .field('registrationDate', regData)
//       .expect(409)
//       .then(() => { done(); });
//   });

//   test('They cannot register an account with a duplicate username', (done) => {
//     agent
//       .post('/Register')
//       .field('email', testEmail2)
//       .field('password', testPasswordCorrect)
//       .field('username', testUsername1)
//       .field('registrationDate', regData)
//       .expect(409)
//       .then(() => { done(); });
//   });
});


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
const testUsername3 = 'testUsername3';
const testUsername4 = 'testUsername4';
const testUsername5 = 'testUsername5';
const testUsername6 = 'testUsername6';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testEmail3 = 'testEmail3@test.com';
const testEmail4 = 'testEmail4@test.com';
const testEmail5 = 'testEmail5@test.com';
const testEmail6 = 'testEmail6@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';
const testMessageForText = 'hello';
const testMediaMessage = '';
const testStatusTextContent = 'what\'s up';
const testStatusType1 = 'text';
const testMessageType1 = 'text';
const testRoomID = '123456';
const regData = Date.now();

let server;
let agent;
// jest.setTimeout(30000);

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
  afterAll((done) => {
    User
      .deleteMany(
        {
        $or: [
          { email: testEmail1 },
          { email: testEmail2 },
          // { email: testEmail3 },
        ],
      }
    ).then(done);
  });

  test('They can register an account', (done) => {
    agent
      .post('/Register')
      .field('email', testEmail2)
      .field('username', testUsername2)
      .field('password', testPasswordCorrect)
      .expect(201)
      .then(() => { done(); });
  });

  test('They are not authorized', (done) => {
    agent
      .get('/checkAuthen')
      .expect(401)
      .then(() => { done(); });
  });

  test('They cannot register an account with a duplicate username', (done) => {
    agent
      .post('/Register')
      .field('email', testEmail1)
      .field('username', testUsername1)
      .field('password', testPasswordCorrect)
      .field('registrationDate', regData)
      .expect(409)
      .then(() => { done(); });
  });

  test('They cannot get user information if not logged in',(done)=>{
    agent
      .get('/getUser')
      .field('username',testEmail1)
      .expect(401)
      .then(()=> { done(); });
  });

  test('They cannot get users to sort based on time if not logged in',(done)=>{
    agent
      .get('/getSortedUser')
      .field('username',testEmail1)
      .expect(401)
      .then(()=> { done(); });
  });

  test('They cannot log in with an invalid password', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail1,
        password: testPasswordIncorrect,
      })
      .expect(401)
      .then(() => { done(); });
  });


  test('They cannot add a new contact if not logged in',(done)=>{
    agent
      .post('/addContact')
      .field('userToAdd',testEmail1)
      .field('curUser',testEmail2)
      .expect(400)
      .then(() => { done(); });
  });

  test('They cannot get suggested users if not logged in',(done)=>{
    agent
      .get('/getSuggestedUsers')
      .field('userName',testEmail1)
      .expect(550)
      .then(() => { done();});
  });

  test('They cannot get any text message via room if not logged in',(done)=>{
    agent
      .get('/getMessageViaRoom')
      .field('sender',testEmail1)
      .field('receiver',testEmail2)
      .field('textMessage',testMessageForText)
      .expect(550)
      .then(() => { done(); });
  });

  test('They cannot get any media message via room if not logged in',(done)=>{
    agent
      .get('/getMessageViaRoom')
      .field('sender',testEmail1)
      .field('receiver',testEmail2)
      .field('mediaMessage',testMediaMessage)
      .expect(550)
      .then(() => { done(); });
  });

  test('They cannot send any message if not logged in',(done)=>{
    agent
      .post('/sendMessage')
      .field('testRoomId',testRoomID)
      .field('text',testMessageForText)
      .field('messageType',testMessageType1)
      .field('sender',testEmail1)
      .field('receiver',testEmail2)
      .expect(422)
      .then(() => { done(); });
  });

  test('They are locked out', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail1,
        password: testPasswordIncorrect,
      })
      .expect(401)
      .then(() => { done(); });
  });

  // test('They cannot block a user if not logged in', async (done)=>{
  //   await (
  //     agent
  //     .put('/blockUser')
  //     .field('curUser',testEmail1)
  //     .field('userToBlock',testEmail2)
  //   )
  //     .expect(400)
  //     .then(() => {done();});
  // });

  // test('They cannot get other\'s status if not logged in',async (done)=>{
  //   await(
  //     agent
  //     .get('/getStatus')
  //     .field('logUser',testEmail1)
  //   )
  //     .expect(400)
  //     .then(() => { done(); });
  // });

  // test('They cannot send status if not logged in',(done)=>{
  //   agent
  //     .post('/sendStatus')
  //     .field('currentUser',testStatusType1)
  //     .field('testSt',testStatusTextContent)
  //     .expect(401)
  //     .then(() => { done(); });
  // });


  
});


describe('When a user is logged in', () => {

  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/Register')
        .field('email', testEmail4)
        .field('username', testUsername4)
        .field('password', testPasswordCorrect)
        .field('registrationDate', regData)
        .then(() => { requestDone(); }),


        (requestDone) => agent
          .post('/login')
          .expect(200)
          .send({
            email:testEmail4,
            password: testPasswordCorrect,
          })
          .then(()=>{requestDone();}),
    ], done);
  });

  afterAll((done) => {
    User
      .deleteMany(
        {
          $or: [
            { username: testUsername4 },
          ],
        },
      )
  });

  
  test('User NO.4 is authorized', (done) => {
    agent
      .get('/checkAuthen')
      .expect(200)
      .then(() => { done(); });
  });


  test('User NO.4 can log out', (done) => {
    agent
      .post('/logout')
      .expect(200)
      .then(() => { done(); });
  });

});

describe('When a user fails too many login attempts', () => {

  beforeAll((done) => {
    async.series([
      (requestDone) => agent
      .post('/Register')
      .field('email', testEmail5)
      .field('username', testUsername5)
      .field('password', testPasswordCorrect)
      .field('registrationDate', regData)
      .then(() => { requestDone(); }),

      (requestDone) => agent
      .post('/login')
      .send({
        email: testEmail5,
        password: testPasswordIncorrect,
      })
      .then(() => { requestDone(); }),
    (requestDone) => agent
      .post('/login')
      .send({
        email: testEmail5,
        password: testPasswordIncorrect,
      })
      .then(() => { requestDone(); }),
    (requestDone) => agent
      .post('/login')
      .send({
        email: testEmail5,
        password: testPasswordIncorrect,
      })
      .then(() => { requestDone(); }),
  ], done);

    });

    afterAll((done) => {
      User
        .deleteOne(
          {username:testUsername5}
        )
        .then(done);
    });

    test('User NO.5 is locked out', (done) => {
      agent
        .post('/login')
        .send({
          email: testEmail5,
          password: testPasswordCorrect,
        })
        .expect(401)
        .then(() => { done(); });
    });



});

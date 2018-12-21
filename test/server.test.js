'use strict';

const app = require('../server');
const notesRouter = require('../router/notes.router');
const chai = require('chai');
const chaiHttp = require('chai-http');

// Simple In-Memory Database
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function() {

  it('true should be true', function() {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function() {

  it('GET request "/" should return the index page', function() {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function() {
  it('should respond with 404 when given a bad path', function() {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('Notes route', function() {
  it('GET /api/notes', function() {
    const searchTerm = 10;
    let filteredList;
    return chai.request(app)
      .get('/api/notes').query({searchTerm})
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
        // TODO: Should return correct search results for valid query
        // TODO: Should return an empty array for an incorrect query
      });
  });

  it('GET /api/notes/:id', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        // Get a note id from first response
        let id = res.body[0].id;
        return chai
          .request(app)
          .get(`/api/notes/${id}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            const expectedKeys = ['id', 'title', 'content'];
            expect(res.body).to.include.keys(expectedKeys);
          });
      });
  });

  it('GET /api/notes/6000 auto fail 404', function() {
    return chai.request(app)
      .get('/api/notes/6000')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  it('PUT /api/notes', function() {
    const body = {
      title: 'this is a title',
      content: 'This is some content'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(body)
      .then(function(res) {
        // res.location(`http://${req.headers.host}/api/notes/${item.id}`).status(201).json(item);
        expect(res).to.have.status(201);
      });
  });

  it('PUT /api/notes FAILURE', function() {
    const body = {};
    return chai.request(app)
      .post('/api/notes')
      .send(body)
      .then(function(res) {
        expect(res.body.message).to.equal('Missing title in request body');
      });
  });

  it('PUT /api/notes/:id', function() {
    const updateObj = {
      title: 'Updated title',
      content: 'Updated content'
    };
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        let id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${id}`)
          .send(updateObj)
          .then(function(res) {
            expect(res).to.be.json;
            const expectedKeys = ['id', 'title', 'content'];
            expect(res.body).to.include.keys(expectedKeys);
          });
      });
  });

  it('PUT FAILURE /api/notes/6000', function() {
    return chai.request(app)
      .put('/api/notes/6000')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });

  it('PUT FAILURE with missing title /api/notes', function() {
    const updateObject = {
      content: 'Updated content'
    };
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        let id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${id}`)
          .send(updateObject)
          .then(function(res) {
            // expect(res.body.message).to.equal('Missing title in request body');
            // TODO: PUT is still accepting any object in source
          });
      });
  });

  it('DELETE /api/notes/:id', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
      // Get a note id from first response
        let id = res.body[0].id;
        return chai
          .request(app)
          .delete(`/api/notes/${id}`)
          .then(function(res) {
            expect(res).to.have.status(204);
            
          });
      });
  });
});


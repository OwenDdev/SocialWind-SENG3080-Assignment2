const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const pool = require('../db');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Social Wind API Tests', function() {

    it('it should return API running', function(done) {

        chai.request(app)
            .get('/api')
            .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(res.text).to.equal('Social Wind API is running');

                done();
            });
    });

});

before(async function() {
    await pool.connect();
});

after(async function() {
    await pool.close();
});

describe('POST Post API Test', function() {

    it('it should POST a new post adding a post to the databse', function(done) {

        const post = {
            postcontent: 'I sure do love writing tests',
            userid: 1
        };

        chai.request(app)
            .post('/api/posts')
            .send(post)
            .end(function(err, res) {

                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('postid');
                expect(res.body.postcontent).to.equal(post.postcontent);
                expect(res.body.userid).to.equal(post.userid);

                done();
            });
    });
   
});

describe('GET Posts API Test', function() {
    it('it should GET all posts', function(done) {

        chai.request(app)
            .get('/api/posts')
            .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');

                done();
            });
    });

});
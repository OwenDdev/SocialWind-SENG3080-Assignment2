/*
* FILE : api.test.jss
* PROJECT : Asiignment2 backend
* PROGRAMMER : Precious Orewen
* FIRST VERSION : 2026-11-10
* DESCRIPTION :
* This file contains a test suite of 12 test for the server/backend of social wind utilizing chai and mocha from the tutorials 
* Refrences: Test a node RESTful API with mocha and Chai | DigitalOcean. (n.d.). Www.Digitalocean.Com. Retrieved November 10, 2026, from https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai
* 
*/

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const pool = require('../db');

chai.use(chaiHttp);

const expect = chai.expect;

describe('Social Wind API Tests', function() {

    it('it should return API running', function(done) {

        //arrange 
        chai.request(app)
            //act
            .get('/api')
            .end(function(err, res) {
                //assert
                expect(res).to.have.status(200);
                expect(res.text).to.equal('Social Wind API is running');

                done();
            });
    });

});

// allows test connect to the database
before(async function() {
    await pool.connect();
});

after(async function() {
    await pool.close();
});

const testUsername = 'mocha_latte' + Date.now();

describe('/POST users', function() {

    it('it should not POST a user without a username', function(done) {

        const user = {};

        //arrange 
        chai.request(app)
            //act
            .post('/api/users')
            .send(user)
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');

                done();
            });
    });

    it('it should POST a new user', function(done) {

        const user = {
            username: testUsername
        };

        //arrange
        chai.request(app)
            //act
            .post('/api/users')
            .send(user)
            .end(function(err, res) {

                //assert
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('userid');
                expect(res.body.username).to.equal(user.username);

                done();
            });
    });

    it('it should return an existing user', function(done) {

        const user = {
            username: testUsername
        };

        //arrange
        chai.request(app)
            //act
            .post('/api/users')
            .send(user)
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('userid');
                expect(res.body.username).to.equal(user.username);

                done();
            });
    });

});
 
describe('/POST post', function() {

    it('it should POST a new post adding a post to the databse', function(done) {

        const post = {
            postcontent: 'I sure do love writing tests',
            userid: 1
        };

        //arrange
        chai.request(app)
            //act
            .post('/api/posts')
            .send(post)
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('postid');
                expect(res.body.postcontent).to.equal(post.postcontent);
                expect(res.body.userid).to.equal(post.userid);

                done();
            });
    });

    it('it should not POST a post without post content', function(done) {

    const post = {
        userid: 1
    };

    //arrange
    chai.request(app)
        //act
        .post('/api/posts')
        .send(post)
        .end(function(err, res) {
            
            //assert
            expect(res).to.have.status(400);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('message');

            done();
            });
    });
   
});

describe('/GET post', function() {
    it('it should GET all posts', function(done) {

        //arrange
        chai.request(app)
            //act
            .get('/api/posts')
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');

                done();
            });
    });

});

describe('/POST likes', function() {

    it('it should like to a post', function(done) {

        //arrange
        const like = {
            userid: 10,
            postid: 1
        };

        //act
        chai.request(app)
            .post('/api/likes')
            .send(like)
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('isliked');

                done();
            });
    });

});

describe('/GET like', function() {

    it('it should GET the likes of a post', function(done) {

        //arrange
        chai.request(app)
            //act
            .get('/api/likes/1?userid=10')
            .end(function(err, res) {

                //assert
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('totalLikes');
                expect(res.body).to.have.property('isLiked');

                done();
            });
    });

});

describe('/POST comments', function() {

    it('it should not POST a comment without comment content', function(done) {

        //arrange
        const comment = {
            userid: 1,
            postid: 1
        };

        chai.request(app)
            //act
            .post('/api/comments')
            .send(comment)
            .end(function(err, res) {

                //assert
                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');

                done();
            });
    });

    it('it should POST a new comment', function(done) {

        //arrange
        const comment = {
            commentcontent: 'This is a test comment',
            userid: 1,
            postid: 1
        };
        
        chai.request(app)
            //act
            .post('/api/comments')
            .send(comment)
            .end(function(err, res) {

                //assert
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('commentid');
                expect(res.body.commentcontent).to.equal(comment.commentcontent);
                expect(res.body.userid).to.equal(comment.userid);
                expect(res.body.postid).to.equal(comment.postid);

                done();
            });
    });

});

describe('/GET comments', function() {

    it('it should GET all comments for a post', function(done) {

        //arrange
        chai.request(app)
            //act
            .get('/api/comments/1')
            .end(function(err, res) {
                
                //assert
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');

                done();
            });
    });

});


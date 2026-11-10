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


describe('/POST post', function() {

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

describe('/GET post', function() {
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

describe('/POST likes', function() {

    it('it should like to a post', function(done) {

        const like = {
            userid: 10,
            postid: 1
        };

        chai.request(app)
            .post('/api/likes')
            .send(like)
            .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(res.body).to.have.property('isliked');

                done();
            });
    });

});

describe('/GET like', function() {

    it('it should GET the likes of a post', function(done) {

        chai.request(app)
            .get('/api/likes/1?userid=10')
            .end(function(err, res) {

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

        const comment = {
            userid: 1,
            postid: 1
        };

        chai.request(app)
            .post('/api/comments')
            .send(comment)
            .end(function(err, res) {

                expect(res).to.have.status(400);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message');

                done();
            });
    });

    it('it should POST a new comment', function(done) {

        const comment = {
            commentcontent: 'This is a test comment',
            userid: 1,
            postid: 1
        };

        chai.request(app)
            .post('/api/comments')
            .send(comment)
            .end(function(err, res) {

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

        chai.request(app)
            .get('/api/comments/1')
            .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');

                done();
            });
    });

});


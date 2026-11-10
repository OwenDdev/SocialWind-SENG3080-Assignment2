const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');

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
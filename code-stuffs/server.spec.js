const server = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { assert, expect } = chai;

describe("Server!", () => {
    // Sample test case given to test / endpoint.
    it("Returns the default welcome message", (done) => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equals("success");
          assert.strictEqual(res.body.message, "Welcome!");
          done();
        });
    });


  //Abigail Sullivan - db test case
  it('tests book_db connection', done => {
    books_db.connection.connect ((err, result) => {
        if(err){
            done(err);
            return;
        }
        expect(result).to.equal("books_db connecttion successful.");
        done();
    });
  });

  //Cody Aker - recommendation test case
  it('tests if recommendations page has any errors (status code should be 200)', done => {
    chai
      .request(server)
      .get("/recommendations")
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
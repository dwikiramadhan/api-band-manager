const chai = require("chai");
const chaiHttp = require("chai-http");
const {app, db} = require("../app"); // Import your Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe("Band API Test", () => {
  // Define variables for testing band_id
  let bandId;
  let playerId;
  
  // This test case runs before any other tests
  before(async () => {
    // Start a database transaction
    await db.query('BEGIN');
  });

  // Test POST /api/band
  describe("POST /api/band", () => {
    it("should create a new band", (done) => {
      chai
        .request(app)
        .post("/api/band")
        .send({ name: "Test Band", max_member: 5 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Band created successfully");
          // Assuming the response contains the created band's ID
          bandId = res.body.data.id;
          done();
        });
    });
  });

  // Test GET /api/band/{band_id}
  describe("GET /api/band/{band_id}", () => {
    it("should get details of a band", (done) => {
      chai
        .request(app)
        .get(`/api/band/${bandId}`) // Use the band ID from the previous test
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Success");
          expect(res.body.data.name).to.equal("Test Band");
          done();
        });
    });
  });

  // Test GET /api/band
  describe("GET /api/band", () => {
    it("should get a list of bands", (done) => {
      chai
        .request(app)
        .get("/api/band")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Success");
          // Assuming the response contains an array of bands
          expect(res.body.data).to.be.an("array");
          done();
        });
    });
  });

  // Test PUT /api/band/{band_id}
  describe("PUT /api/band/{band_id}", () => {
    it("should update an existing band", (done) => {
      chai
        .request(app)
        .put(`/api/band/${bandId}`) // Use the band ID from the first test
        .send({ name: "Updated Band", max_member: 10 })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Band update successfully");
          done();
        });
    });
  });

  // Test POST /api/band
  describe("POST /api/player", () => {
    it("should create a new player", (done) => {
      chai
        .request(app)
        .post("/api/player")
        .send({ name: "Test Player", position: "Gitarist" })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal("Player created successfully");
          // Assuming the response contains the created band's ID
          playerId = res.body.data.id;
          done();
        });
    });
  });

  // Test POST /api/band/member
  describe("POST /api/band/member", () => {
    it("should add a new member into a band", (done) => {
      chai
        .request(app)
        .post("/api/band/member")
        .send({ band_id: bandId, player_id: playerId }) // Provide valid band_id and player_id
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          expect(res.body.message).to.equal(
            "Add member into the band successfully"
          );
          memberId = res.body.data.id;
          done();
        });
    });
  });

  // This test case runs after all other tests
  after(async () => {
    // Roll back the database transaction to undo changes made during testing
    if (bandId) {
      try {
        await db.query("ROLLBACK");
        console.log("Cleanup: Rolled back the database transaction.");
      } catch (error) {
        console.error(
          "Cleanup: Error rolling back the database transaction:",
          error
        );
      }
    }
  });
});

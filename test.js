var app = require('./app.js');
var request = require('supertest').agent(app.listen());
//var r = require('rethinkdbdash')();
var co = require('co');

describe("Testing Http Api", function () {
  it("Should return successfully saved of new created game", function (done) {
    request
      .post('/games')
      .send({field: "kazgu", type: "open"})
      .expect("location", /^\/games\/.*$/)
      .expect(201, done)
  });
  it("Should return game by id", function (done) {
    co(function *() {
      // хочу получить идентификатор из созданной игры
      var gameInfo = yield app.r.table('games').insert({field: "aes", type: "open"}).run();
      var id = gameInfo.generated_keys[0];
      var url = '/games/' + id;
      console.log(url);
      request
        .get(url)
        .expect(200)
        .expect({id: id,field: "aes", type: "open"}, done)
    });
  });
  it("should modify the game with this id",function(done) {
    co(function *() {
    var gameModify = yield app.r.table('games').insert({field: "turan", type: "closed"}).run();
    var id = gameModify.generated_keys[0];
    var url = '/games/' + id;
    request
      .put(url)
      .send({field: "kazgu", type: "open"})
      .expect(200)
      .expect({id: id, field: "kazgu", type: "open"}, done)
    });
  });
  it("Should return list of games",function(done){
    request
      .get('/games')
      .expect(200, done)
  })
});
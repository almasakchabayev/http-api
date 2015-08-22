var koa = require('koa');
var app = koa();
var Router = require('koa-router');
var routes = new Router();
var parse = require('co-body');
var r = require('rethinkdbdash')();
routes.post('/games', function*() {
  var gameFromRequest = yield parse(this);
  // receive data and parse
  // save game
  var game = yield r.table('games').insert(gameFromRequest).run();
  // set location in header
  this.set('location', '/games/' + game.id);
  this.status = 201;
});

routes.get('/games/:id', function*() {
  var body = yield r.table('games').get(this.params.id).run();
  this.body = body;
});

routes.put('/games/:id',function*(){
  var gameFromRequestM = yield parse(this);
  yield r.table('games').get(this.params.id).update(gameFromRequestM).run();
  var game = yield r.table('games').get(this.params.id).run();
  this.status = 200;
  this.body = game;
});
routes.get('/games/', function*() {
  var body = yield r.table('games').run();
  console.log(body);
  this.body = body;
});
app.r = r;
app.use(routes.middleware());
module.exports = app;
app.listen(3000);
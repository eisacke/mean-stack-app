const router = require('express').Router();
const events = require('../controllers/events');
const users = require('../controllers/users');
const auth = require('../controllers/auth');
const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index)
  .post(secureRoute, events.create);

router.route('/events/:id')
  .get(events.show)
  .delete(secureRoute, events.delete);

router.route('/events/:id/locations')
  .post(secureRoute, events.addLocation);

router.route('/events/:id/locations/:locationId')
  .delete(secureRoute, events.deleteLocation);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.route('/users/:id')
  .get(users.show);

router.all('/*', (req, res) => res.notFound());

module.exports = router;

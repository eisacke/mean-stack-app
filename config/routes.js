const router = require('express').Router();
const events = require('../controllers/events');
const users = require('../controllers/users');
const auth = require('../controllers/auth');
const geonames = require('../controllers/geonames');
const invites = require('../controllers/invites');
const secureRoute = require('../lib/secureRoute');

router.route('/events')
  .get(events.index)
  .post(secureRoute, events.create);

router.route('/events/:id')
  .get(events.show)
  .put(secureRoute, events.update)
  .delete(secureRoute, events.delete);

router.route('/events/:id/locations')
  .post(secureRoute, events.addLocation);

router.route('/events/:id/locations/:locationId')
  .delete(secureRoute, events.deleteLocation);

router.route('/events/:id/invitees')
  .post(secureRoute, events.addInvitee);

router.route('/events/:id/invitees/:inviteeId')
  .delete(secureRoute, events.deleteInvitee);

router.route('/events/:id/send')
  .post(invites.send);

router.route('/register')
  .post(auth.register);

router.route('/login')
  .post(auth.login);

router.route('/users/:id')
  .get(users.show);

router.route('/code')
  .get(geonames.getCountryCode);

router.all('/*', (req, res) => res.notFound());

module.exports = router;

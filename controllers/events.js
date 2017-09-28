const Event = require('../models/event');

function indexRoute(req, res, next) {
  Event
    .find()
    .populate('createdBy')
    .exec()
    .then((events) => res.json(events))
    .catch(next);
}

function createRoute(req, res, next) {

  if(req.file) req.body.image = req.file.filename;
  req.body.createdBy = req.currentUser;

  Event
    .create(req.body)
    .then((event) => res.status(201).json(event))
    .catch(next);
}

function showRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((event) => {
      if(!event) return res.notFound();

      return res.json(event);
    })
    .catch(next);
}

function deleteRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .exec()
    .then((event) => {
      if(!event) return res.notFound();

      return event.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addLocationRoute(req, res, next) {

  req.body.createdBy = req.currentUser;

  Event
    .findById(req.params.id)
    .exec()
    .then((event) => {
      if(!event) return res.notFound();

      const location = event.locations.create(req.body);
      event.locations.push(location);

      return event.save()
        .then(() => res.json(location));
    })
    .catch(next);
}

function deleteLocationRoute(req, res, next) {
  Event
    .findById(req.params.id)
    .exec()
    .then((event) => {
      if(!event) return res.notFound();

      const location = event.locations.id(req.params.locationId);
      location.remove();

      return event.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  delete: deleteRoute,
  addLocation: addLocationRoute,
  deleteLocation: deleteLocationRoute
};

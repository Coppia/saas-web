/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/idea              ->  index
 * POST    /api/idea              ->  create
 * GET     /api/idea/:id          ->  show
 * PUT     /api/idea/:id          ->  update
 * DELETE  /api/idea/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Idea from './idea.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Ideas
export function index(req, res) {
  return Idea.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Idea from the DB
export function show(req, res) {
  return Idea.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Idea in the DB
export function create(req, res) {
  return Idea.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Idea in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Idea.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Idea from the DB
export function destroy(req, res) {
  return Idea.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

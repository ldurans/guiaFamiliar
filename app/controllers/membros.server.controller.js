'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Membro = mongoose.model('Membro'),
	_ = require('lodash');

/**
 * Create a Membro
 */
exports.create = function(req, res) {
	var membro = new Membro(req.body);
	membro.user = req.user;

	membro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(membro);
		}
	});
};

/**
 * Show the current Membro
 */
exports.read = function(req, res) {
	res.jsonp(req.membro);
};

/**
 * Update a Membro
 */
exports.update = function(req, res) {
	var membro = req.membro ;

	membro = _.extend(membro , req.body);

	membro.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(membro);
		}
	});
};

/**
 * Delete an Membro
 */
exports.delete = function(req, res) {
	var membro = req.membro ;

	membro.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(membro);
		}
	});
};

/**
 * List of Membros
 */
exports.list = function(req, res) { 
	Membro.find().sort('-created').populate('user', 'displayName').exec(function(err, membros) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(membros);
		}
	});
};

/**
 * Membro middleware
 */
exports.membroByID = function(req, res, next, id) { 
	Membro.findById(id).populate('user', 'displayName').exec(function(err, membro) {
		if (err) return next(err);
		if (! membro) return next(new Error('Failed to load Membro ' + id));
		req.membro = membro ;
		next();
	});
};

/**
 * Membro authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.membro.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

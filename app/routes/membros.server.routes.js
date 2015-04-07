'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var membros = require('../../app/controllers/membros.server.controller');

	// Membros Routes
	app.route('/membros')
		.get(membros.list)
		.post(users.requiresLogin, membros.create);

	app.route('/membros/:membroId')
		.get(membros.read)
		.put(users.requiresLogin, membros.hasAuthorization, membros.update)
		.delete(users.requiresLogin, membros.hasAuthorization, membros.delete);

	// Finish by binding the Membro middleware
	app.param('membroId', membros.membroByID);
};

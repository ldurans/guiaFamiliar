'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Membro = mongoose.model('Membro'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, membro;

/**
 * Membro routes tests
 */
describe('Membro CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Membro
		user.save(function() {
			membro = {
				name: 'Membro Name'
			};

			done();
		});
	});

	it('should be able to save Membro instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Membro
				agent.post('/membros')
					.send(membro)
					.expect(200)
					.end(function(membroSaveErr, membroSaveRes) {
						// Handle Membro save error
						if (membroSaveErr) done(membroSaveErr);

						// Get a list of Membros
						agent.get('/membros')
							.end(function(membrosGetErr, membrosGetRes) {
								// Handle Membro save error
								if (membrosGetErr) done(membrosGetErr);

								// Get Membros list
								var membros = membrosGetRes.body;

								// Set assertions
								(membros[0].user._id).should.equal(userId);
								(membros[0].name).should.match('Membro Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Membro instance if not logged in', function(done) {
		agent.post('/membros')
			.send(membro)
			.expect(401)
			.end(function(membroSaveErr, membroSaveRes) {
				// Call the assertion callback
				done(membroSaveErr);
			});
	});

	it('should not be able to save Membro instance if no name is provided', function(done) {
		// Invalidate name field
		membro.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Membro
				agent.post('/membros')
					.send(membro)
					.expect(400)
					.end(function(membroSaveErr, membroSaveRes) {
						// Set message assertion
						(membroSaveRes.body.message).should.match('Please fill Membro name');
						
						// Handle Membro save error
						done(membroSaveErr);
					});
			});
	});

	it('should be able to update Membro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Membro
				agent.post('/membros')
					.send(membro)
					.expect(200)
					.end(function(membroSaveErr, membroSaveRes) {
						// Handle Membro save error
						if (membroSaveErr) done(membroSaveErr);

						// Update Membro name
						membro.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Membro
						agent.put('/membros/' + membroSaveRes.body._id)
							.send(membro)
							.expect(200)
							.end(function(membroUpdateErr, membroUpdateRes) {
								// Handle Membro update error
								if (membroUpdateErr) done(membroUpdateErr);

								// Set assertions
								(membroUpdateRes.body._id).should.equal(membroSaveRes.body._id);
								(membroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Membros if not signed in', function(done) {
		// Create new Membro model instance
		var membroObj = new Membro(membro);

		// Save the Membro
		membroObj.save(function() {
			// Request Membros
			request(app).get('/membros')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Membro if not signed in', function(done) {
		// Create new Membro model instance
		var membroObj = new Membro(membro);

		// Save the Membro
		membroObj.save(function() {
			request(app).get('/membros/' + membroObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', membro.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Membro instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Membro
				agent.post('/membros')
					.send(membro)
					.expect(200)
					.end(function(membroSaveErr, membroSaveRes) {
						// Handle Membro save error
						if (membroSaveErr) done(membroSaveErr);

						// Delete existing Membro
						agent.delete('/membros/' + membroSaveRes.body._id)
							.send(membro)
							.expect(200)
							.end(function(membroDeleteErr, membroDeleteRes) {
								// Handle Membro error error
								if (membroDeleteErr) done(membroDeleteErr);

								// Set assertions
								(membroDeleteRes.body._id).should.equal(membroSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Membro instance if not signed in', function(done) {
		// Set Membro user 
		membro.user = user;

		// Create new Membro model instance
		var membroObj = new Membro(membro);

		// Save the Membro
		membroObj.save(function() {
			// Try deleting Membro
			request(app).delete('/membros/' + membroObj._id)
			.expect(401)
			.end(function(membroDeleteErr, membroDeleteRes) {
				// Set message assertion
				(membroDeleteRes.body.message).should.match('User is not logged in');

				// Handle Membro error error
				done(membroDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Membro.remove().exec();
		done();
	});
});
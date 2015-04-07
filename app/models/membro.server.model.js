'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Membro Schema
 */
var MembroSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Membro name',
		trim: true
	},
	grauParentesco: {
		type: String,
		default: '',
		required: 'Informar o grau de parentesco',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Membro', MembroSchema);

'use strict';

//Setting up route
angular.module('membros').config(['$stateProvider',
	function($stateProvider) {
		// Membros state routing
		$stateProvider.
		state('listMembros', {
			url: '/membros',
			templateUrl: 'modules/membros/views/list-membros.client.view.html'
		}).
		state('createMembro', {
			url: '/membros/create',
			templateUrl: 'modules/membros/views/create-membro.client.view.html'
		}).
		state('viewMembro', {
			url: '/membros/:membroId',
			templateUrl: 'modules/membros/views/view-membro.client.view.html'
		}).
		state('editMembro', {
			url: '/membros/:membroId/edit',
			templateUrl: 'modules/membros/views/edit-membro.client.view.html'
		});
	}
]);
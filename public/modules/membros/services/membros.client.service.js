'use strict';

//Membros service used to communicate Membros REST endpoints
angular.module('membros').factory('Membros', ['$resource',
	function($resource) {
		return $resource('membros/:membroId', { membroId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Membros controller
angular.module('membros').controller('MembrosController', ['$scope', '$stateParams', '$location', 'Authentication', 'Membros',
	function($scope, $stateParams, $location, Authentication, Membros) {
		$scope.authentication = Authentication;

		// Create new Membro
		$scope.create = function() {
			// Create new Membro object
			var membro = new Membros ({
				name: this.name
			});

			// Redirect after save
			membro.$save(function(response) {
				$location.path('membros/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Membro
		$scope.remove = function(membro) {
			if ( membro ) { 
				membro.$remove();

				for (var i in $scope.membros) {
					if ($scope.membros [i] === membro) {
						$scope.membros.splice(i, 1);
					}
				}
			} else {
				$scope.membro.$remove(function() {
					$location.path('membros');
				});
			}
		};

		// Update existing Membro
		$scope.update = function() {
			var membro = $scope.membro;

			membro.$update(function() {
				$location.path('membros/' + membro._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Membros
		$scope.find = function() {
			$scope.membros = Membros.query();
		};

		// Find existing Membro
		$scope.findOne = function() {
			$scope.membro = Membros.get({ 
				membroId: $stateParams.membroId
			});
		};
	}
]);
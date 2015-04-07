'use strict';

(function() {
	// Membros Controller Spec
	describe('Membros Controller Tests', function() {
		// Initialize global variables
		var MembrosController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Membros controller.
			MembrosController = $controller('MembrosController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Membro object fetched from XHR', inject(function(Membros) {
			// Create sample Membro using the Membros service
			var sampleMembro = new Membros({
				name: 'New Membro'
			});

			// Create a sample Membros array that includes the new Membro
			var sampleMembros = [sampleMembro];

			// Set GET response
			$httpBackend.expectGET('membros').respond(sampleMembros);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.membros).toEqualData(sampleMembros);
		}));

		it('$scope.findOne() should create an array with one Membro object fetched from XHR using a membroId URL parameter', inject(function(Membros) {
			// Define a sample Membro object
			var sampleMembro = new Membros({
				name: 'New Membro'
			});

			// Set the URL parameter
			$stateParams.membroId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/membros\/([0-9a-fA-F]{24})$/).respond(sampleMembro);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.membro).toEqualData(sampleMembro);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Membros) {
			// Create a sample Membro object
			var sampleMembroPostData = new Membros({
				name: 'New Membro'
			});

			// Create a sample Membro response
			var sampleMembroResponse = new Membros({
				_id: '525cf20451979dea2c000001',
				name: 'New Membro'
			});

			// Fixture mock form input values
			scope.name = 'New Membro';

			// Set POST response
			$httpBackend.expectPOST('membros', sampleMembroPostData).respond(sampleMembroResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Membro was created
			expect($location.path()).toBe('/membros/' + sampleMembroResponse._id);
		}));

		it('$scope.update() should update a valid Membro', inject(function(Membros) {
			// Define a sample Membro put data
			var sampleMembroPutData = new Membros({
				_id: '525cf20451979dea2c000001',
				name: 'New Membro'
			});

			// Mock Membro in scope
			scope.membro = sampleMembroPutData;

			// Set PUT response
			$httpBackend.expectPUT(/membros\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/membros/' + sampleMembroPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid membroId and remove the Membro from the scope', inject(function(Membros) {
			// Create new Membro object
			var sampleMembro = new Membros({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Membros array and include the Membro
			scope.membros = [sampleMembro];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/membros\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMembro);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.membros.length).toBe(0);
		}));
	});
}());
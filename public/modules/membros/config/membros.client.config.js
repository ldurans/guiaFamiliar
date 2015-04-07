'use strict';

// Configuring the Articles module
angular.module('membros').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Membros', 'membros', 'dropdown', '/membros(/create)?');
		Menus.addSubMenuItem('topbar', 'membros', 'List Membros', 'membros');
		Menus.addSubMenuItem('topbar', 'membros', 'New Membro', 'membros/create');
	}
]);
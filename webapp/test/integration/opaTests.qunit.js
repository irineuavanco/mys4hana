/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/iaj/mys4hanasalesorders/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});
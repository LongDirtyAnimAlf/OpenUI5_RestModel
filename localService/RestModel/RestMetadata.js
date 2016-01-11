/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */



// Provides class sap.ui.model.rest.RestMetadata
sap.ui.define(['jquery.sap.global', 'sap/ui/model/odata/ODataMetadata'],
	function(jQuery, ODataMetadata) {
	"use strict";

	// This whole REST metadata is one big trick to allow the REST model to work !!!
	// Nothing good about it yet.
	// This is the place where much work has to be done to allow REST
	// to use many of the odata features.
	// But for now: just use it and do'nt judge it !!
	
	var RestMetadata = ODataMetadata.extend("sap.ui.model.rest.RestMetadata", /** @lends sap.ui.model.rest.RestMetadata.prototype */ {

		constructor : function(sMetadataURI, mParams) {
			
			ODataMetadata.apply(this, arguments);
			
			var oModel,
			that = this;
			
			this.fnResolve;
			// new global promise
			this.pLoaded = new Promise(function(resolve, reject) {
					that.fnResolve = resolve;
			}); 			
		},
		metadata : {
			publicMethods : ["setModel"]
		}
	});
	
	// New method !!
	// Set model, while we change metadata in model itself from REST model !!!
	RestMetadata.prototype.setModel = function(oModel) {
		this.oModel = oModel;
	};

	RestMetadata.prototype.isLoaded = function() {
		return true;
	};

	RestMetadata.prototype.isFailed = function() {
		return false;
	};

	RestMetadata.prototype.getServiceMetadata = function() {
		if (this.oModel && this.oModel.oMetadata) {
			return this.oModel.oMetadata;
		}
	};
	
	RestMetadata.prototype.loaded = function() {
		return this.pLoaded;
	}; 	
	

	// Below are experiments ... some working, most not working,
	// Just for future reference
	// *********************************************************
	
	RestMetadata.prototype._getEntityTypeByPath = function(sPath) {
		if (this.oModel && this.oModel.oMetadata && this.oModel.oMetadata.mEntityTypes) {
			if (this.oModel.oMetadata.mEntityTypes[sPath]) {
				return this.oModel.oMetadata.mEntityTypes[sPath];
			} 		
		}
		return null;
	};
	
	/*
	RestMetadata.prototype.setEntityTypeByPath = function(sPath, aData) {
		console.log("RestMetadata.prototype._setEntityTypeByPath");
		console.log(sPath);		
		var oChangeObject = this._getEntityTypeByPath[sPath];
	};
	*/

	return RestMetadata;
});

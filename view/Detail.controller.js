sap.ui.define([
	'sap/ui/demo/SapRestDemo/localService/BaseController',
	'sap/ui/demo/SapRestDemo/model/formatter'
], function (BaseController, formatter) {
	
	return BaseController.extend("sap.ui.demo.SapRestDemo.view.Detail", {
		formatter : formatter,
		
		_oTemplate : {},
		
		onInit : function () {
			this._router().getRoute("Detail").attachPatternMatched(this._routePatternMatched, this);
			var oRepoTable = this.getView().byId("RepoTable");
			// A dummy is used to get template info !!!
			// See xml for items = "{dummy}"
			// If this is ommitted, no template is available
			// But this is a nice trick to get things working ... ;-)
			this._oTemplate = oRepoTable.getBindingInfo("items").template;
		},

		_routePatternMatched: function(oEvent) {
			
			var sId = oEvent.getParameter("arguments").id;
			var	oView = this.getView();
			var oModel = oView.getModel();
			var sPath = "/users/"+sId;
			var oData = oModel.getProperty(sPath);

      //parameters : {select:'login'}

			oView.bindElement({
				path: sPath,
				events: {
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				},
        parameters : {select:'name,company,location,bio,email,avatar_url',key:'login'}
			});
			
			//if there is no data the model has to request new data
			if (!oData) {
				oView.setBusyIndicatorDelay(0);
				oView.getElementBinding().attachEventOnce("dataReceived", function() {
					// reset to default
					oView.setBusyIndicatorDelay(null);
					this._checkIfDetailAvailable(sPath, sId);
				}.bind(this));
			} else {
				var	oRepoTable = oView.byId("RepoTable");
				var sRepoPath = oData.repos_url;
				
				if (sRepoPath) {
					// repos_url is an absolute http path
					// therefor, remove sServiceUrl
					
					sRepoPath = sRepoPath.replace(oModel.sServiceUrl,"");
					if (!jQuery.sap.startsWith(sRepoPath, "/")) {
						sRepoPath = "/"+sRepoPath;	
					};
					
					// bind to correct path with extra key info in parammeters
					// key for repos is id
					// key for users is login
					oRepoTable.bindItems({					
						path : sRepoPath,
						sorter : {
							path : 'name',
							descending: false
						},
						parameters :{
							key:'id'
						},
						template:this._oTemplate 
					});
				}
			}
		},

		_checkIfDetailAvailable: function(sPath, sId) {
			var oModel = this.getView().getModel();
			var oData = oModel.getProperty(sPath);
			if (!oData) {
				// show not found page				
				this._router().getTargets().display("notFound", sId);
			}
		},

		handleUserMailButtonPress: function() {
			var oData = this.getView().getBindingContext().getProperty();
			sap.m.URLHelper.triggerEmail(oData.email);
		}
	});
});

sap.ui.define([
	'sap/ui/demo/SapRestDemo/localService/BaseController',
	'sap/ui/demo/SapRestDemo/model/formatter'
], function (BaseController, formatter) {
	
	var oTemplateEqui;	
	
	return BaseController.extend("sap.ui.demo.SapRestDemo.view.Detail", {
		formatter : formatter,
		
		onInit : function () {
			this._router().getRoute("Detail").attachPatternMatched(this._routePatternMatched, this);
			var oTableEqui = this.getView().byId("RepoTable");
			oTemplateEqui = oTableEqui.getBindingInfo("items").template;
			console.log("oTemplateEqui");			
			console.log(oTemplateEqui);
			
		},

		_routePatternMatched: function(oEvent) {
			
			console.log("got route !!!!!");
			console.log(oEvent.getSource());			
			
			var sId = oEvent.getParameter("arguments").id;
			var	oView = this.getView();
			var oModel = oView.getModel();
			var sPath = "/users/"+sId;
			var sKey = sPath.substr(1);
			var oData = oModel.oData[sKey];
			
			console.log("oData");
			console.log(oModel);			
			console.log(oData);			
			console.log(sPath);			
			console.log(sKey);			
			
			//oView.objectBindings({			
			oView.bindElement({
				path: sPath,
				events: {
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				}
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
				console.log("sRepoPath");				
				var	oRepoTable = oView.byId("RepoTable");
				console.log(oRepoTable);				
				var sRepoPath = oData.repos_url;
				console.log(sRepoPath);				
				sRepoPath = sRepoPath.replace(oModel.sServiceUrl,"");
				if (!jQuery.sap.startsWith(sRepoPath, "/")) {
					sRepoPath = "/"+sRepoPath;	
				};				
				console.log(sRepoPath);
				/*
				oRepoTable.bindElement({
					path: sRepoPath,
					sorter : {
						path : 'name',
						descending: false
					},
					parameters :{
						key:'id'
					}
				});
				*/

				oRepoTable.bindRows(sRepoPath);				
				
				/*
				oRepoTable.bindAggregation("items", sRepoPath, function(sId, oContext) {
				     return new sap.m.ColumnListItem({
				    	 cells: [
				             new sap.m.Label({ text: oContext.getProperty("name") }),
				             new sap.m.Label({ text: oContext.getProperty("description") })
				          ]
				      })
				});
				*/
			}
		},

		_checkIfDetailAvailable: function(sPath, sId) {
			var oModel = this.getView().getModel();
			// remove starting slash
			var sKey = sPath.substr(1);
			var oData = oModel.oData[sKey];
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

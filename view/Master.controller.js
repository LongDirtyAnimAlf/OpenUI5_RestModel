sap.ui.define([
	'sap/ui/demo/SapRestDemo/localService/BaseController',
	'sap/ui/demo/SapRestDemo/model/formatter',
	'sap/ui/Device',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (BaseController,
			 formatter,
			 Device,
			 Filter,
			 FilterOperator) {
	"use strict";

	var oSorter = new sap.ui.model.Sorter("login", false, function (oContext) {
		var name = oContext.getProperty("login");
		var sKey = name.charAt(0);
		var text = name.charAt(0);
		return {
			key: sKey, // group by first letter of login
			text: text
		};
	});
	
	
	return BaseController.extend("sap.ui.demo.SapRestDemo.view.Master", {
		formatter : formatter,

		onInit : function () {
		},

		handleSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				this.handleRefresh(this.getView().byId("pullToRefresh"));
			} else {
				var sQuery = oEvent.getParameter("query");
				var oView = this.getView();
				var oUserList = oView.byId("UserList");
				var bShowSearch = sQuery.length !== 0;
				
				if (bShowSearch) {
					this._changeNoDataTextToIndicateLoading(oUserList);
				}
				
				var oBinding = oUserList.getBinding("items");
				if (oBinding) {
				
					if (!bShowSearch) {
						// reset sorter
						oBinding.sort();
					}

					if (bShowSearch) {
						oBinding.filter(new sap.ui.model.Filter("login", sap.ui.model.FilterOperator.Contains, sQuery));
					} else {
						oBinding.filter([]);
					}
				}
			}
		},
		
		_changeNoDataTextToIndicateLoading: function (oList) {
			var sOldNoDataText = oList.getNoDataText();
			oList.setNoDataText("Loading...");
			oList.attachEventOnce("updateFinished", function () {
				oList.setNoDataText(sOldNoDataText);
			});
		},
		
		
		handleUserListSelect : function (oEvent) {
			this._showUser(oEvent);
		},

		handleUserListItemPress : function (oEvent) {
			this._showUser(oEvent);
		},

		handleUserSortButtonPress: function (oEvent) {
			var oView = this.getView();
			var oUserList = oView.byId("UserList");
			var oBinding = oUserList.getBinding("items");
			oBinding.sort(oSorter);			
		},		
		
		_showUser: function (oEvent) {
			var oBindContext;
			if (sap.ui.Device.system.phone) {
				oBindContext = oEvent.getSource().getBindingContext();
			} else {
				oBindContext = oEvent.getSource().getSelectedItem().getBindingContext();
			}
			var oModel = oBindContext.getModel();
			var sPath = oBindContext.getPath();
			var oUser = oModel.getProperty(sPath);
			var sUserId = oUser.login;			
			this._router().navTo("Detail", {id: sUserId}, !Device.system.phone);
		}
	});
});

sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
    "sap/m/library",
    "sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, mobileLibrary, MessageToast) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;

	return BaseController.extend("com.iaj.mys4hanasalesorders.controller.AddSalesOrder", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit : function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy : false,
				delay : 0,
                lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading"),
                salesOrder: 
                        {
                            "SoId": "000",                            
                            "CreatedBy": "400000038",
                            "CreatedAtDats": "2021-03-19T01:01:01",
                            "ChangedBy": "400000038",
                            "ChangedAtDats": "2021-03-19T01:01:01",
                            "CreatedByBp": "X",
                            "BuyerId": "100000002",
                            "BuyerName" : "unknown",
                            "CurrencyCode": "USD",
                            "GrossAmount": "0.0",
                            "NetAmount": "0.0",
                            "TaxAmount": "0.0",
                            "LifecycleStatus": "N",
                            "BillingStatus": "N",
                            "DeliveryStatus": "N",
                            "ToItems": [ ]
                        }                
			});

			this.getRouter().getRoute("addSalesOrder").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "addSalesOrderView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

        addNewItem: function(oEvent) {
              var oViewModel = this.getView().getModel("addSalesOrderView");
              var items = oViewModel.getProperty("/salesOrder/ToItems");
            
              var it =  items.length + 1;
              var itPos = it.toString();

              var simpleData = 
              		{
                        "SoId": "000",
                        "SoItemPos" :  itPos,  
                        "ProductId": "HT-1001",
                        "CurrencyCode": "USD",
                        "GrossAmount": "0.00",
                        "NetAmount": "0.00",
                        "TaxAmount": "0.00",
                        "DeliveryDateDats": "2021-03-03T03:03:03",
                        "Quantity": "1",
                        "Name": "unknow"
                    };

              items.push(simpleData);

              oViewModel.setProperty("/salesOrder/ToItems", items);

        },

        /**
         * Save Sales order
         * @param {*} oEvent 
         */
        onSaveOrder : function(oEvent)  {
              var soid_ = "";
              var oDataObj  =  this.getView().getModel();
              var oViewModel = this.getView().getModel("addSalesOrderView");                
              var payload = oViewModel.getProperty("/salesOrder");

        /**
         *     Para desativer o controle CSRF token no servidor
         */
              oDataObj.setHeaders({
                 'X-Requested-With': 'X',
                 'Content-Type' :  'application/json'
              });

              oDataObj.create("/SOHeaderSet", payload, {
                   success:  function(oData, oResponse) {
                       var msg =   ['Ordem de Venda ', oResponse.data.SoId , 'criada com sucesso!'].join(' ');
                       MessageToast.show(msg);
                       var mylocation = location; 
                       mylocation.reload();    
                   },

                   error: function(){
                        MessageToast.error("Erro ao salvar Ordem de Venda!");
                   }
              });

        },


		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */



		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched : function (oEvent) {
			

		},




		_onMetadataLoaded : function () {


		},



		/**
		 * Toggle between full and non full screen mode.
		 */
		toggleFullScreen: function () {
			var bFullScreen = this.getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			if (!bFullScreen) {
				// store current layout and go full screen
				this.getModel("appView").setProperty("/previousLayout", this.getModel("appView").getProperty("/layout"));
				this.getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			} else {
				// reset to previous layout
				this.getModel("appView").setProperty("/layout",  this.getModel("appView").getProperty("/previousLayout"));
			}
		}
	});

});
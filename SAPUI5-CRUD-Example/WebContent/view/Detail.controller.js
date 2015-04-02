sap.ui.core.mvc.Controller.extend("sap.usrmgm.view.Detail", {
  onInit: function() {
    sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
  },

  onRouteMatched: function(oEvent) {
    var oParameters = oEvent.getParameters();

    // when detail navigation occurs, update the binding context
    if (oParameters.name !== "detail") {
      return;
    }

    var sEntityPath = "/" + oParameters.arguments.entity;
    this.bindView(sEntityPath);
  },

  bindView: function(sEntityPath) {
    var oView = this.getView();
    oView.bindElement(sEntityPath);

    // check if the data already on the client
    if (!oView.getModel().getData(sEntityPath)) {
      // check that the entity specified actually was found
      oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
        var oData = oView.getModel().getData(sEntityPath);
        if (!oData) {
          this.showEmptyView();
        } else {
          // 
        }
      }, this));
    }
  },

  showEmptyView: function() {
    sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
      currentView: this.getView(),
      targetViewName: "sap.usrmgm.view.NotFound",
      targetViewType: "XML"
    });
  },

  
  onAddUser: function() {
	    sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
	      currentView: this.getView(),
	      targetViewName: "sap.usrmgm.view.AddUser",
	      targetViewType: "XML",
	      transition: "slide"
	    });
	  },
	  
	  
  onUpdate: function() {
    var oView = this.getView();
    var oProperty = this.getView().getBindingContext().getProperty();
    var oModel = this.getView().getModel();
    var mUserData = {};

    mUserData.Uuid = oProperty.Uuid;
    mUserData.Email = oView.byId("idEmail").getValue();
    mUserData.Firstname = oView.byId("idFirstname").getValue();
    mUserData.Lastname = oView.byId("idLastname").getValue();
    mUserData.Age = parseInt(oView.byId("idAge").getValue());
    mUserData.Phone = parseInt(oView.byId("idPhone").getValue());

    
    
    var requestObj = {
    	      requestUri: "/sap/opu/odata/sap/ZUSERINFO_SRV/zuserinfoSet('" + oProperty["Uuid"] + "')",
    	      method: 'PUT',
    	      headers: {
    	        "X-Requested-With": "XMLHttpRequest",
    	        "Content-Type": "application/atom+xml",
    	        "DataServiceVersion": "2.0",
    	        "MaxDataServiceVersion": "2.0",
    	        "Accept": "application/atom+xml",
    	        "X-CSRF-Token": ''
    	      },
    	      data: mUserData
    	    };
/*    
    oModel.update("/zuserinfoSet('" + oProperty["Uuid"] + "')", mUserData, null, function() {
      oModel.refresh();
      alert("Update successful");
    }, function() {
      alert("Update failed");
    });

*/


    OData.request({
      requestUri: "/sap/opu/odata/sap/ZUSERINFO_SRV",
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-Token": "Fetch"
      }
    }, function(data, response) {
      requestObj.headers['X-CSRF-Token'] = response.headers['x-csrf-token'];

      OData.request(requestObj, function() {
        sap.m.MessageToast.show('PUT Operation Succeessfully!');
        oModel.refresh();
      }, function() {
          sap.m.MessageToast.show("PUT Operation Failed");
      });
    });
  },

  onDelete: function() {
    var oView = this.getView();
    var oProperty = oView.getBindingContext().getProperty();
    var oModel = this.getView().getModel();

    oModel.remove("/zuserinfoSet('" + oProperty["Uuid"] + "')", null, function() {
//      alert("Delete successful");
    	sap.m.MessageToast.show("Delete Operation successful");
//      oModel.refresh();

    	 sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
    	      currentView: this.getView(),
    	      targetViewName: "sap.usrmgm.view.NotFound",
    	      targetViewType: "XML"
    	    });
    	 
    	 
    }, function() {
//      alert("Delete failed");
        sap.m.MessageToast.show("Delete Operation Failed");
        
    });
  },

  onCall: function() {
    var oData = this.getView().getBindingContext().getProperty();
    sap.m.URLHelper.triggerTel(oData.Phone);
  },

  onText: function() {
    var oData = this.getView().getBindingContext().getProperty();
    sap.m.URLHelper.triggerSms(oData.Phone);
  },

  onEmail: function() {
    var oData = this.getView().getBindingContext().getProperty();
    sap.m.URLHelper.triggerEmail(oData.Email);
  },

});
sap.ui.core.mvc.Controller.extend("sap.usrmgm.view.AddUser", {
  onInit: function() {
    this.getView().setModel(new sap.ui.model.json.JSONModel(), "newUser");
//	  this.getView().setModel(new sap.ui.model.xml.XMLModel(), "newUser");
	  
  },

  onCancel: function() {
    sap.ui.core.UIComponent.getRouterFor(this).backWithoutHash(this.getView());
  },

  onSave: function() {
    var mData = this.getView().getModel("newUser").getData();
    
    /// need to set the mNewUser as a model ...
    var mNewUser = {
      "Uuid": mData.Uuid,
      "Email": mData.Email,
      "Firstname": mData.Firstname,
      "Lastname": mData.Lastname,
      "Age": parseInt(mData.Age),
      "Phone": parseInt(mData.Phone)
    };
    // send odata create request
    oModel = this.getView().getModel();
	//oModel.setHeaders({"content-type" : "application/xml+atom"});	
	//"Content-Type": "application/atom+xml",
    oModel.create("/zuserinfoSet", mData, {
      success: jQuery.proxy(function(mResponse) {
        jQuery.sap.require("sap.m.MessageToast");
        sap.m.MessageToast.show("User Created " + mNewUser.Email)
      }, this),
      error: jQuery.proxy(function() {
//        alert("Problem creating new user");
        sap.m.MessageToast.show("Problem creating new user: "+ mNewUser.Email)
      }, this)
    });
  }
});
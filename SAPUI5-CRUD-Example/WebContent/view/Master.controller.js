jQuery.sap.require("sap.usrmgm.util.Formatter");
jQuery.sap.require("sap.usrmgm.util.Grouper");

sap.ui.core.mvc.Controller.extend("sap.usrmgm.view.Master", {
  onInit: function() {
    this.oUpdateFinishedDeferred = jQuery.Deferred();
    
    this.getView().byId("list").attachEventOnce("updateFinished", function() {
      this.oUpdateFinishedDeferred.resolve();
    }, this);

    sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this.onRouteMatched, this);
  },

  onRouteMatched: function(oEvent) {
    var sName = oEvent.getParameter("name");

    // wait for the list to be loaded
    jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
      var aItems;
      if (sName !== "main") {
        return
        // on the empty hash select the first item
        // this.selectDetail();
      }
      sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
        currentView: this.getView(),
        targetViewName: "sap.usrmgm.view.Detail",
        targetViewType: "XML"
      });
    }, this));
  },

  onSelect: function(oEvent) {
    this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
  },

  showDetail: function(oItem) {
    // If we're on a phone, include nav in history; if not, don't.
    var bReplace = jQuery.device.is.phone ? false : true;
    sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
      from: "master",
      entity: oItem.getBindingContext().getPath().substr(1)
      // tab: 
    }, bReplace);
  },

  onAddUser: function() {
    sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
      currentView: this.getView(),
      targetViewName: "sap.usrmgm.view.AddUser",
      targetViewType: "XML",
      transition: "slide"
    });
  },

  onSearch: function() {
    var filters = [];
    var searchString = this.getView().byId("searchField").getValue();
    if (searchString && searchString.length > 0) {
      filters = [ new sap.ui.model.Filter("Uuid", sap.ui.model.FilterOperator.Contains, searchString) ];
    }

    // update list binding
    this.getView().byId("list").getBinding("items").filter(filters);
  },
    
  onGroup: function(evt) {
    var sorters = [];
    var item = evt.getParameter("selectedItem"); 
    var key = (item) ? item.getKey() : null;
    if ("Age" === key) {
        var grouper = sap.usrmgm.util.Grouper[key];
        sorters.push(new sap.ui.model.Sorter(key, true, grouper)); 
    }
     
    // update binding
    var list = this.getView().byId("list");
    var oBinding = list.getBinding("items");
    oBinding.sort(sorters);
  }
});
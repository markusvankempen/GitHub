jQuery.sap.declare("sap.usrmgm.Component");
jQuery.sap.require("sap.usrmgm.MyRouter"); // a custom Router

sap.ui.core.UIComponent.extend("sap.usrmgm.Component", {
  metadata: {
    name: "User Management Tool",
    version: "1.0",
    dependencies: {
      libs: ["sap.m", "sap.ui.layout"],
    },
    rootView: "sap.usrmgm.view.App",
    config: {
      resourceBundle: "i18n/messageBundle.properties",
      serviceConfig: {
        name: "AG3",
        serviceUrl: "/sap/opu/odata/sap/ZUSERINFO_SRV/"
      }
    },
    routing: {
      config: {
        routerClass: sap.usrmgm.MyRouter,
        viewType: "XML",
        viewPath: "sap.usrmgm.view",
        // when the router instantiates a view, it should place it in the detail part of our sap.m.SplitApp control
        // The target application parameter contains the name of an aggregation of the target control that contains views. 
        // A NavContainer, for example, has an aggregation called Pages and the shell container has Content.
        // Q: what if I change the Detail.view.xml name to SomethingElse.view.xml, do I do SomethingElsePages here?
        // A: 2/20/2015, after I changed the Detail.view.xml (as well as its controller) name, 'detailPages' still work
        targetAggregation: "detailPages",
        // don't want the target aggregation (detailPages) to be cleared before views are added
        clearTarget: false
      },
      routes: [
        // each configuration object has a single mandatory parameter name,
        // all other parameters are optiona
        {
          // a "main" route that causes the Master view to be placed in the masterPages aggregation of the sap.m.SplitApp
          pattern: "",
          name: "main",
          view: "Master",
          targetAggregation: "masterPages",
          targetControl: "idAppControl",
          subroutes: [
            {
              // a detail view that causes the Detail view to be instantiated 
              // and placed into the detailPages aggregation of the sap.m.SplitApp
              pattern: "{entity}", 
              name: "detail",
              view: "Detail"
            }
          ]
        },
        {
          // currently, this does not really take effect, the NotFound view display trigger sits in the detail page controller
          name: "catchallMaster",
          view: "Master",
          targetAggregation: "masterPages",
          targetControl: "idAppControl",
          subroutes: [
            {
              pattern: ":all*:",
              name: "catchallDetail",
              view: "NotFound"
            }
          ] 
        }
      ]
    }
  },

  init: function() {
    sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

    var mConfig = this.getMetadata().getConfig();
    var rootPath = jQuery.sap.getModulePath("sap.usrmgm");
    var sServiceUrl = mConfig.serviceConfig.serviceUrl;
      
    var i18nModel = new sap.ui.model.resource.ResourceModel({
      bundleUrl: [rootPath, mConfig.resourceBundle].join('/')
    });   
      
    var bIsMocked = jQuery.sap.getUriParameters().get("mock") === "true";
    // start the mock server for the domain model
    if (bIsMocked) {
      this._startMockServer(sServiceUrl);
      var oMockModel = new sap.ui.model.odata.ODataModel("http://mymockserver/", true);
      this.setModel(oMockModel);
    } else {
      var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
      this.setModel(oModel);
    }

    // to enable two-way binding, it does not work though, return RFC Error: Field symbol has not yet been assigned.
    // oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

    var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
    });
    deviceModel.setDefaultBindingMode("OneWay");
    this.setModel(deviceModel, "device");

    // the initialize method will start the routing â€“ it will parse the initial hash, create the needed views, start listening to hash changes and trigger the router events.
    this.getRouter().initialize();
  },
    
  _startMockServer : function () {
      jQuery.sap.require("sap.ui.core.util.MockServer");
      var oMockServer = new sap.ui.core.util.MockServer({
          rootUri: "http://mymockserver/"
      });

      oMockServer.simulate("model/metadata.xml", "model/");
      oMockServer.start();

      sap.m.MessageToast.show("Running in demo mode with mock data.", {
          duration: 2000
      });
  }
});
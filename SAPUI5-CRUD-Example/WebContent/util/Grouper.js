jQuery.sap.declare("sap.usrmgm.util.Grouper");

sap.usrmgm.util.Grouper = {
    Age: function (oContext) {
        var age = oContext.getProperty("Age");
        var key = null,
            text = null;
        
        if (age >= 18) {
            key = "adult";
            text = "Adult";
        } else {
            key = "juveniles";
            text = "Juveniles";
        }
        
        return {
            key: key,
            text: text
        };
        
    }
};
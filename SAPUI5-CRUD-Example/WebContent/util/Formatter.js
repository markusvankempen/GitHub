jQuery.sap.declare("sap.usrmgm.util.Formatter");

sap.usrmgm.util.Formatter = {

    joinFullname: function(sFirstname, sLastname) {
        return sFirstname + " " + sLastname;   
    },
    
    uuidPrettifier: function(sStr) {
        return "No." + sStr;   
    }
    
};
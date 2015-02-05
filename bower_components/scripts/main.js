var ref = new Firebase("https://decisionmaker.firebaseio.com");
var authData = ref.getAuth();
if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
} else {
    ref.authAnonymously(function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
}

window.setInterval(function() {
    $("#yarotate").toggle();
    $("#narotate").toggle();
}, 1000);

var gaPlugin;

function onDeviceReady() {
    gaPlugin = window.plugins.gaPlugin;
    gaPlugin.init(successHandler, errorHandler, "UA-59414317-1", 60);
}

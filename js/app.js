'use strict';

(function(){
    $(document).ready(function(){
        tableau.extensions.initializeAsync({'configure':configure}).then(() => {
            buildMessage();
            var worksheetName = tableau.extensions.settings.get("worksheet");
            var worksheet = getWorksheetByName(worksheetName);
            worksheet.addEventListener(tableau.TableauEventType.FilterChanged, (event) => {
                buildMessage();
            }, function() {
                console.log("Error while initializing:" + err.toString()); 
            });
        })
    })

    function getWorksheetByName(worksheetName){
        const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
        
        var worksheet = worksheets.find(function(sheet){
            return sheet.name === worksheetName;
        });

        return worksheet;
    }

    function buildMessage() {
        var worksheetName = tableau.extensions.settings.get("worksheet");
        var worksheet = getWorksheetByName(worksheetName);
        var message = tableau.extensions.settings.get("message");

        $("#worksheet").text(worksheetName);
        $("#message").text(message);

        worksheet.getSummaryDataAsync().then((sumdata) =>{
            var dataLength = sumdata.data.length;
            if (dataLength > 0){
                var recordString = "There are " + dataLength + " records";
                $(".msg").text(recordString);
            }else {
                (message) ? $(".msg").text(message) : $(".msg").text("Set your message in Configuration menu")
            }
         });
    };

    function configure() {

        const popupUrl = `${window.location.origin}/dialog.html`;
        let defaultPayload = "";
        tableau.extensions.ui.displayDialogAsync(popupUrl, defaultPayload, { height:300, width:500 }).then((closePayload) => {
            buildMessage();
        }).catch((error) => {
            switch (error.errorCode) {
                case tableau.ErrorCodes.DialogClosedByUser:
                   console.log("Dialog was closed by user");
                   break;
                default:
                   console.error(error.message);
            }
        });
    }

})();
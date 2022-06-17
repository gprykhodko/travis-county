require([
    "esri/config",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/ScaleBar",
    "esri/widgets/Legend",
    "esri/Graphic",
    "esri/rest/print",
    "esri/rest/support/PrintTemplate",
    "esri/rest/support/PrintParameters"

  ], (esriConfig, WebMap, MapView, ScaleBar, Legend, Graphic, print, PrintTemplate, PrintParameters) => {

  
    esriConfig.portalUrl = "https://devportal.halff.com/portaldev";
    
    const webmap = new WebMap({
      portalItem: {
        id: "6927fdc1d10b4d61840f129820c5fa12"
      }
    });
    const view = new MapView({
      map: webmap,
      container: "viewDiv"
    });

// url to the print service
const url = "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";

    const template = new PrintTemplate({
  format: "jpg",
  exportOptions: {
    dpi: 300
  },
  layout: "a4-portrait",
  layoutOptions: {
    //titleText: "Flood Depth Report",
    authorText: "Halff."
  }
});

const params = new PrintParameters({
  view: view,
  template: template
});





const printBtn = document.getElementById("printBtn");
view.ui.add(printBtn, "top-right");

printBtn.addEventListener("click", () => {

    let popUpTitle = document.querySelector(".esri-popup__header-container--button").innerHTML
    let popUpContents = document.querySelector(".esri-popup__content").innerHTML
    let brandingLogo = '<br><center> <img src="https://www.halff.com/wp-content/themes/mastertheme-v3-halff/images/main-logo.png" height="40"> </center><br>'; // <h1 style="color:#0098db;">Report Description</h1, to add a logo insert <img src="https://www.halff.com/wp-content/themes/mastertheme-v3-halff/images/main-logo.png" height="40">
    let divText = brandingLogo + popUpTitle + popUpContents + '<link rel="stylesheet" href="https://js.arcgis.com/4.21/esri/themes/light/main.css" />' 
    const executePrint = print.execute(url, params)
    .then(result => {
      return result.url
    }); 
    
    const printMap = (flood_info) => {

        executePrint.then((m) => {
        let map = `<center> <img src="${m}" height="800"> </center>`
        let myWindow = window.open('', '', '');
        let doc = myWindow.document;
        doc.open();
        doc.write(flood_info + map); 
        doc.close();
            setTimeout(function() { 
            myWindow.print(); 
             }, 1000);
        
    });
      
    };  

     
     printMap(divText);
     

});


    view.on("click", function(event){
        createGraphic(event.mapPoint.latitude, event.mapPoint.longitude);
      });

      /*************************
       * Create a point graphic
       *************************/
      function createGraphic(lat, long){
        // First create a point geometry 
        var point = {
          type: "point", // autocasts as new Point()
          longitude: long,
          latitude: lat
        };

        // Create a symbol for drawing the point
          let markerSymbol = {
            type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
            url: "https://static.arcgis.com/images/Symbols/Basic/RedStickpin.png",
            width: "44px",
            height: "44px",
            yoffset: "19px"
          };
        

        // Create a graphic and add the geometry and symbol to it
        var pointGraphic = new Graphic({
          geometry: point,
          symbol: markerSymbol
        });

        // Add the graphics to the view's graphics layer
        view.graphics.add(pointGraphic);
      }

    
  });

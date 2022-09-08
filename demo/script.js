

require([
  "esri/config",
  "esri/WebMap",
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/ScaleBar",
  "esri/widgets/Legend",
  "esri/Graphic",
  "esri/rest/print",
  "esri/rest/support/PrintTemplate",
  "esri/rest/support/PrintParameters",
  "esri/layers/FeatureLayer",
  "esri/layers/MapImageLayer",
  "esri/widgets/LayerList",
  "esri/widgets/Slider",
  "esri/Basemap",
  "esri/widgets/BasemapGallery",
  "esri/widgets/BasemapToggle",
  "esri/widgets/Home",
  "esri/widgets/Search",
  "esri/rest/identify",
  "esri/rest/support/IdentifyParameters"

], (esriConfig, WebMap, Map, MapView, ScaleBar, Legend, Graphic, print, PrintTemplate, PrintParameters, FeatureLayer, MapImageLayer,
    LayerList, Slider, Basemap, BasemapGallery, BasemapToggle, Home, Search, identify, IdentifyParameters
  ) => {


  esriConfig.portalUrl = "https://devportal.halff.com/portaldev";
  
  //NearMap basemap
  const nearmap = new Basemap({
    baseLayers: [
      new MapImageLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        title: "Basemap"
      })
    ],
    title: "NearMap",
    id: "basemap"
  });

  const cityBoundary = new FeatureLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Municipal_Jurisdictions_Boundaries/MapServer/0/",
    title: "Municipal Jurisdictions Boundaries",
    opacity: 0.5,
    visible: false,
    popupTemplate: {
      title: "{NAME}"
    }
  });
  

  const countyBoundary = new FeatureLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Boundary/MapServer/0/query?outFields=*&where=1%3D1"
  });
  
  //Travis Counties Facilities Feature Service
  const facilities = new FeatureLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Services_and_Facilities/Travis_County_Facilities/MapServer/0",
    visible: false,
    popupTemplate: {
      title: "{FACILITY}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "LOCATION",
              label: "Location"
            }
          ]
        }
      ]
    }
  });


  //Emergency Service Districts Feature Service
  const esd = new FeatureLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Services_and_Facilities/Emergency_Service_Districts_ESDs/MapServer/0",
    visible: false,
    opacity: 0.5,
    title: "Emergency Service Districts (ESDs)",
    popupTemplate: {
      title: "{ESD_Name}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "Address"
            }
          ]
        }
      ]
    }
  });

  //Justice Court and Constable Precincts Feature Service
  const courts = new FeatureLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Judge_and_Constable_Precincts/MapServer/0",
    visible: false,
    title: "Justice Court and Constable Precincts",
    opacity: 0.5,
    popupTemplate: {
      title: "Precinct# {PRECINCT}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "Judge"
            }
          ]
        }
      ]
    }
  });

    //1 Percent Depth Image
    const depth1 = new MapImageLayer({
      url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
      opacity: 0.5,
      listMode: "hide-children",
      title: "Flood Depth (1%) in feet",
      sublayers: [
        {
          id: 12
        }
      ]
  
  });

    const depth02 = new MapImageLayer({
      url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
      opacity: 0.5,
      listMode: "hide-children",
      title: "Flood Depth (0.2%) in feet",
      visible: false,
      sublayers: [
        {
          id: 16
        }
      ]

  });

    const wsel1 = new MapImageLayer({
      url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
      opacity: 0.5,
      listMode: "hide-children",
      title: "WSEL (1%) in feet",
      visible: false,
      sublayers: [
        {
          id: 20
        }
      ]

  });

    const wsel02 = new MapImageLayer({
      url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
      opacity: 0.5,
      listMode: "hide-children",
      title: "WSEL (0.2%) in feet",
      visible: false,
      sublayers: [
        {
          id: 24
        }
      ]

  });

  const webmap = new Map({
    basemap: "satellite", 
    layers: [countyBoundary, cityBoundary, courts, esd, wsel02, wsel1, depth02, depth1,  facilities]
  });

  
  /*const generateReport = {
    title: "Generate Report",
    id: "generate-report",
    image: "http://static.arcgis.com/images/Symbols/PeoplePlaces/Information.png",
    //className: "esri-icon-documentation"
  };*/

  const view = new MapView({
    container: "viewDiv",
    map: webmap,
    zoom: 11,
    center: [-97.73556, 30.28820], //center on travis county
    constraints: {
      rotationEnabled: false,
      minZoom: 10,
      maxZoom: 18
    }
    /*popup: {
      alignment: "top-right",
      actions: [generateReport]
    }*/

  });

  const toggle = new BasemapToggle({
    view: view, 
    nextBasemap: nearmap,
    visibleElements: {
      title: true
    }
  });

  
  let homeWidget = new Home({
    view: view
  });

  const searchWidget = new Search({
    view: view
  });

  // Add a legend instance to the panel of a
  // ListItem in a LayerList instance
    const layerList = new LayerList({
      view: view,
      selectionEnabled: true,
      listItemCreatedFunction: (event) => {
        let item = event.item;
        if (item.layer.type != "group") {
          // don't show legend twice
          item.panel = {
            content: "legend"
          }; 
        } if (item.layer.type == "map-image") {
          item.panel = {
            content: "legend",
            open: false
          }; 
        } 
      }
   });

   view.ui.add([
    {
      component: layerList,
      position: "top-right",
      index: 1
    }, {
      component: toggle,
      position: "bottom-right"
    }, {
      component: homeWidget,
      position: "top-left",
      index: 0
    }, {
      component: "halffLogoDiv",
      position: "manual",
      index: 1
    }, { 
      component: "countyLogoDiv",
      position: "bottom-left",
      index: 0
    }, {
      component: searchWidget,
      position: "top-right",
      index: 0
    }

  ]);

 
  //using identify method on the map service
  let params;
  view.when(function () {
    // executeIdentify() is called each time the view is clicked
    view.on("click", executeIdentify);

    // Set the parameters for the identify
    params = new IdentifyParameters();
    params.tolerance = 0;
    params.layerIds = [12, 16, 20, 24];
    params.layerOption = "visible";
    params.width = view.width;
    params.height = view.height;
  });

  function executeIdentify(event) {
    // Set the geometry to the location of the view click
    params.geometry = event.mapPoint;
    params.mapExtent = view.extent;
    document.getElementById("viewDiv").style.cursor = "wait";

    // This function returns a promise that resolves to an array of features
    // A custom popupTemplate is set for each feature based on the layer it
    // originates from
    identify
      .identify(depth1.url, params)
      .then(function (response) {
        var results = response.results;

        return results.map(function (result) {
          var feature = result.feature;
          var layerName = result.layerName;

          feature.attributes.layerName = layerName;
          if (layerName === "1 Percent Depth Image") {
            feature.popupTemplate = {
              // autocasts as new PopupTemplate()
              title: "Flood Depth (1%)",
              content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
            };
            console.log(feature)
          } else if (layerName === ".2 Percent Depth Image") {
            feature.popupTemplate = {
              // autocasts as new PopupTemplate()
              title: " Flood Depth (0.2%)",
              content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
            };
          } 

            else if (layerName === "1 Percent WSEL Image") {
              feature.popupTemplate = {
                // autocasts as new PopupTemplate()
                title: "WSEL (1%)",
                content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
              };
            }  else if (layerName === ".2 Percent WSEL Image") {
              feature.popupTemplate = {
                // autocasts as new PopupTemplate()
                title: "WSEL (0.2%)",
                content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
              };
            } 


          return feature;
        });
      })
      .then(showPopup); // Send the array of features to showPopup()

    // Shows the results of the identify in a popup once the promise is resolved
    function showPopup(response) {
      if (response.length > 0 && response[3].attributes['Pixel Value'] != "NoData") {
        console.log(response)
        view.popup.open({
          features: response,
          location: event.mapPoint
        });
      }
      document.getElementById("viewDiv").style.cursor = "auto";
    }
  }
  
});

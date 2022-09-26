//Function to create a quick pop up template with all fields
const quickPopup = layer => {
    switch(layer.type) {
      case "group":
        console.log("group", layer.title);
        layer.allLayers.items.forEach(
        layer => {
        //console.log(layer.type, layer.title)
          if (layer.type === "map-image") {
            layer.allSublayers.forEach(sublayer => {
               sublayer
                .load()
                  .then(loadedSublayer => {
                    console.log("map-image", loadedSublayer.layer.title);
                    //console.log(loadedSublayer);
                    const popupTemplate = loadedSublayer.createPopupTemplate();
                    loadedSublayer.popupTemplate = popupTemplate;
                  }); 
            });
          } 
          else if (layer.type === "feature") {
            //console.log(layer.type, layer.title);
            layer
              .load()
                .then(loadedSublayer => {
                console.log("feature", layer.title);
                //console.log(loadedSublayer);
                const popupTemplate = loadedSublayer.createPopupTemplate();
                loadedSublayer.popupTemplate = popupTemplate;
              });
          }
        });
        break;
      case "map-image":
        //console.log("map-image");
        layer.allSublayers.forEach(sublayer => {
          console.log(sublayer);
          sublayer
            .load()
              .then(loadedSublayer => {
                console.log(loadedSublayer);
                const popupTemplate = loadedSublayer.createPopupTemplate();
                loadedSublayer.popupTemplate = popupTemplate;
              });
        });
        break;
      case "feature":
            //console.log("feature");
            layer
              .load()
                .then(loadedSublayer => {
                console.log("feature", layer.title);
                //console.log(loadedSublayer);
                const popupTemplate = loadedSublayer.createPopupTemplate();
                loadedSublayer.popupTemplate = popupTemplate;
              });
            break;
    }
  }

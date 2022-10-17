function distanceMeasurement() {
    const type = view.type;
    measurement.activeTool =
      type.toUpperCase() === "2D" ? "distance" : "direct-line";
    distanceButton.classList.add("active");
    areaButton.classList.remove("active");
  }

function areaMeasurement() {
    measurement.activeTool = "area";
    distanceButton.classList.remove("active");
    areaButton.classList.add("active");
  }


function clearMeasurements() {
    distanceButton.classList.remove("active");
    areaButton.classList.remove("active");
    measurement.clear();
  }



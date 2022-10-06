require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
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
    "esri/rest/support/IdentifyParameters",
    "esri/layers/GroupLayer",
    "esri/layers/WMSLayer",
    "esri/WebMap",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement"
], (esriConfig, Map, MapView, Legend, Graphic, print, PrintTemplate, PrintParameters, FeatureLayer, MapImageLayer,
    LayerList, Slider, Basemap, BasemapGallery, BasemapToggle, Home, Search, identify, IdentifyParameters, GroupLayer, WMSLayer, 
    WebMap, ScaleBar, Measurement) => {

//NearMap basemap
const nearmap = new Basemap({
    baseLayers: [
      new WMSLayer({
        url: "https://api.nearmap.com/wms/v1/latest/apikey/ZmY1MDZkYmYtYzViMy00MzA0LTkzMzQtN2MzMGQzZjcyYTk2",
        sublayers: [{
          name: "United States of America latest"
        }]
      })
    ],
    title: "NearMap",
    id: "nearmap",
    thumbnailUrl: "https://www.nearmap.com/etc.clientlibs/nearmap/clientlibs/site/resources/images/favicon.png"
  });
  //Municipal Jurisdictions
  const jurisdictions = new GroupLayer({
    title: "Municipal Jurisdictions",
    layers: [  
      new MapImageLayer({
        url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/LCRA_HWLO/MapServer",
        title: "LCRA HLWO",
        opacity: 0.5,
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      }),  
      new FeatureLayer({ //Municipal Jurisdictions (Full Purpose)
        url: "https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/BOUNDARIES_jurisdictions/FeatureServer/0",
        title: "Austin LTD & ETJs",
        opacity: 0.5,
        visible: false,
        popupTemplate: {
          title: "{CITY_NAME}"
        }
      }),
      new MapImageLayer({ //Municipal ETJs (without City of Austin)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Municipal_Jurisdictions_Boundaries/MapServer/",
        opacity: 0.5,
        listMode: "hide-children",
        title: "Municipal Jurisdictions (ETJs and Dev.Agreements)",
        visible: false,
        sublayers: [
          {
            id: 1
          }
        ]
      }),
      new FeatureLayer({ //Municipal Jurisdictions (Full Purpose)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Municipal_Jurisdictions_Boundaries/MapServer/0/",
        title: "Municipal Jurisdictions (Full Purpose)",
        opacity: 0.5,
        visible: false,
        popupTemplate: {
          title: "{NAME}"
        }
      })
    ]
    
  });
  //County Boundaries
  const countyBoundary = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Boundary/MapServer/",
    listMode: "hide"
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
  //ESRI Roads
  const roads = new FeatureLayer({
    url: "https://services.arcgis.com/0L95CJ0VTaxqcmED/ArcGIS/rest/services/TRANSPORTATION_street_segment/FeatureServer",
    visible: false,
    opacity: 1,
    title: "Roads"
  });
  //Travis County Road Projects
  const roadProjects = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Travis_County_Roads/MapServer",
    listMode: "hide-children",
    title: "County Road Maintenance",
    visible: false,
    sublayers: [
      {
        id: 41,
        labelsVisible: false
      }
    ]

  });
  //TxDOT Annual Avg Daily
  const txdot = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/TxDOT_24HR_Annual_Avg_Daily_Traffic_AADT/MapServer",
    listMode: "hide-children",
    title: "Annual Average Daily Traffic",
    visible: false,
    sublayers: [
      {
        id: 0,
      }
    ]

  });
  //National Weather Service Rainfall data
  const nws = new MapImageLayer({
    url: "https://idpgis.ncep.noaa.gov/arcgis/rest/services/NWS/nws_reference_map/MapServer",
    opacity: 0.5,
    //listMode: "hide-children",
    title: "NWS",
    visible: false

  });
  //Administrative Boundaries
  const adminBoundaries = new GroupLayer({
    title: "Administrative Boundaries",
    layers: [  
      new FeatureLayer({ //Emergency Service Districts Feature Service
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
      }),
      new FeatureLayer({ //Justice Court and Constable Precincts Feature Service
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
      }),
      new MapImageLayer({ //Sheriff's Office Response Districts
        url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Admin_Boundaries_Simple/MapServer",
        title: "Sheriff's Office Response Districts",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 1
          }
        ]
      }),
      new MapImageLayer({ //Commissioner Precincts
        url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Admin_Boundaries_Simple/MapServer",
        title: "Commissioner Precincts",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      })
    ]
    
  });
  //Travis County Subdivisions
  const subdivs = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Subdivisions/MapServer",
    opacity: 0.5,
    listMode: "hide-children",
    title: "Subdivisions",
    visible: false,
    sublayers: [
      {
        id: 0
      }
    ]

  });
  //Parcel boundary
  const parcels = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/TCAD_public/MapServer/",
    opacity: 1,
    listMode: "hide-children",
    title: "Parcel Boundaries",
    visible: false,
    sublayers: [
      {
        id: 0,
        labelsVisible: false
      }
    ]

  });
  //Planning
  const planning = new GroupLayer({
    title: "Planning",
    layers: [
      new GroupLayer({ //Colorado River Corridor Concept Plan (CRCP)
        title: "Colorado River Corridor Concept Plan (CRCP)",
        layers: [
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Landuse",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 9
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Amended Parcels",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 8
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Airport Overlay",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 7
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Airport Overlay Zone",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 6
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "River Access Zones",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 5
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "CRCP Project Area",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 4
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Multi-Modal Trails",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 3
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Roadways",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 2
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Colorado_River_Corridor_Concept_Plan/MapServer",
            title: "Future SCCP Transit Node",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 1
              }
            ]
          }),
        ]
      }),
      new GroupLayer({ //Bicycle Safety Task Force
        title: "Bicycle Safety Task Force",
        layers: [
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Bicycle_Safety_Task_Force/MapServer",
            title: "Spoke System",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 2
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Bicycle_Safety_Task_Force/MapServer",
            title: "Freewheel System",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 1
              }
            ]
          }),
          new MapImageLayer({
            url:"https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Bicycle_Safety_Task_Force/MapServer",
            title: "Candidate Projects for Future Bonds",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
        ]
      }),
      new GroupLayer({ //Land, Water, Tranportation Plan (LWTP)
        title: "Land, Water, Tranportation Plan (LWTP)",
        layers: [
          new GroupLayer({ //Land Conservation Concept
            title: "Land Conservation Concept",
            layers: [
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 0.5,
                listMode: "hide-children",
                title: "Barton & Little Barton Creek Watersheds",
                visible: false,
                sublayers: [
                  {
                    id: 11,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 1,
                listMode: "hide-children",
                title: "Barton & Little Barton Creek Watersheds",
                visible: false,
                sublayers: [
                  {
                    id: 10,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 1,
                listMode: "hide-children",
                title: "Post Oak Savanna (within Travis County)",
                visible: false,
                sublayers: [
                  {
                    id: 9,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 1,
                listMode: "hide-children",
                title: "Prime Farmland",
                visible: false,
                sublayers: [
                  {
                    id: 8,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 1,
                listMode: "hide-children",
                title: "Habitat & Karst Zones",
                visible: false,
                sublayers: [
                  {
                    id: 7,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 1,
                listMode: "hide-children",
                title: "Springs in Unincorporated Travis County",
                visible: false,
                sublayers: [
                  {
                    id: 6,
                    labelsVisible: false
                  }
                ]
            
              }),
            ]
          }),
          new GroupLayer({ //Development Concept
            title: "Development Concept",
            layers: [
              new GroupLayer({
                title: "Transportation Corridors",
                layers: [
                  new MapImageLayer({
                    url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                    opacity: 1,
                    listMode: "hide-children",
                    title: "TNRs Corridors",
                    visible: false,
                    sublayers: [
                      {
                        id: 4,
                        labelsVisible: false
                      }
                    ]
                  }),
                  new MapImageLayer({
                    url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                    opacity: 1,
                    listMode: "hide-children",
                    title: "Imagine Austin",
                    visible: false,
                    sublayers: [
                      {
                        id: 3,
                        labelsVisible: false
                      }
                    ]
                  }),
                ]
              }),
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_LWTP/MapServer",
                opacity: 0.5,
                listMode: "hide-children",
                title: "Activity Centers (2040 CAMPO Plan)",
                visible: false,
                sublayers: [
                  {
                    id: 1,
                    labelsVisible: false
                  }
                ]
              }),          
            ]
          })
        ]
      }),
      new GroupLayer({ //County Transportation Blueprint
        title: "County Transportation Blueprint",
        layers: [
          new GroupLayer({
            title: "Potential Partnership Projects",
            layers: [
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Travis_County_Transportation_Blueprint/MapServer",
                opacity: 0.5,
                listMode: "hide-children",
                title: "Cap Metro Green Line Regional Commuter Rail Corridor",
                visible: false,
                sublayers: [
                  {
                    id: 5,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                  url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Travis_County_Transportation_Blueprint/MapServer",
                  opacity: 0.5,
                  listMode: "hide-children",
                  title: "TXDOT/CTRMA Partnership Projects",
                  visible: false,
                  sublayers: [
                    {
                      id: 4,
                      labelsVisible: false
                    }
                  ]
              
              }),
            ]
          }),
          new GroupLayer({
            title: "County Road Projects",
            layers: [
              new MapImageLayer({
                url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Travis_County_Transportation_Blueprint/MapServer",
                opacity: 0.5,
                listMode: "hide-children",
                title: "County Arterial ROW Requirements",
                visible: false,
                sublayers: [
                  {
                    id: 2,
                    labelsVisible: false
                  }
                ]
            
              }),
              new MapImageLayer({
                  url: "https://gis.traviscountytx.gov/server1/rest/services/Planning/Planning_Travis_County_Transportation_Blueprint/MapServer",
                  opacity: 0.5,
                  listMode: "hide-children",
                  title: "County Arterial Roads",
                  visible: false,
                  sublayers: [
                    {
                      id: 1,
                      labelsVisible: false
                    }
                  ] 
              }),
            ]
          })
        ]
      })
    ]
  });
  //School Districts
  const schoolDistricts = new MapImageLayer({
      url: "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/School_Districts/MapServer",
      opacity: 1,
      listMode: "hide-children",
      title: "School Districts (County Tax Office",
      visible: false,
      sublayers: [
        {
          id: 0,
          labelsVisible: true,
          //popupTemplate:
        }
      ]
  
    });
  //Capital Improvement Projects
  const cip = new GroupLayer({
    title: "Capital Improvement Projects",
    layers: [
      new MapImageLayer({ //Parks and Open Spaces
        url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Capital_Improvement_Projects_CIP/MapServer",
        title: "Parks and Open Spaces",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 2
          }
        ]
      }),
      new MapImageLayer({ //Roads, Sidewalks, and Trail
        url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Capital_Improvement_Projects_CIP/MapServer",
        title: "Roads, Sidewalks, and Trails",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 1
          }
        ]
      }),
      new MapImageLayer({ //Bridges, Intersections, and Drainage
        url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Capital_Improvement_Projects_CIP/MapServer",
        title: "Bridges, Intersections, and Drainage",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0,
            popupTemplate: {
              expressionInfos: [
                {
                  name: "cost",
                  title: "Total Estimated Cost",
                  expression: "'$' + Text($feature.TotalEstimatedCost, '#,###')"
                }
              ],
              title: "{Project_Name}",
              content: [
                {
                  type: "fields",
                  fieldInfos: [
                    {
                      fieldName: "Project_Type",
                      label: "Type"
                    }, {
                      fieldName: "Project_Status",
                      label: "Status"
                    }, {
                      fieldName: "expression/cost",
                    }, {
                      fieldName: "Project_Type",
                      label: "Type"
                    }, {
                      fieldName: "Is_Funded",
                      label: "Funded?"
                    }, {
                      fieldName: "FundSource",
                      label: "Funding Source"
                    }, {
                      fieldName: "Comm_Name_and_Precinct",
                      label: "Commissioner & Precinct"
                    }, {
                      fieldName: "PermalinkMapURL",
                      label: "Permalink"
                    }, {
                      fieldName: "CIPDocURL",
                      label: "CIP Doc URL"
                    },            
                  ]     
                }
              ]
            }
          }
        ]
      }),
    ]
  });
  //Hydrology
  const hydrology = new GroupLayer({
    title: "Hydrology",
    layers: [
      new MapImageLayer({ //Watersheds
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Watersheds/MapServer",
        title: "Watersheds",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 3
          }
        ]
      }),
      new GroupLayer({ //Acuifers
        title: "Aquifers",
        layers: [
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Aquifers/MapServer",
            title: "Major Aquifers",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 3
              }
            ]
          }),
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Aquifers/MapServer",
            title: "Minor Aquifers",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 2
              }
            ]
          }),
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Aquifers/MapServer",
            title: "Edwards Aquifer Recharge Zone",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 1
              }
            ]
          }),
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Aquifers/MapServer",
            title: "Edwards Aquifer Contributing Zones",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          })
        ]
      }),
      new GroupLayer({ //Surface Water
        title: "Surface Water",
        layers: [
          new FeatureLayer({ //Other
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Surface_Water/MapServer/8",
            title: "Other",
            visible: false,
          }),
          new MapImageLayer({ //Stream Segements
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Surface_Water/MapServer",
            title: "Stream Segments",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 12
              }
            ]
          }),
          new FeatureLayer({ //Creeks
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Surface_Water/MapServer/11",
            title: "Creeks",
            visible: false
          }),
          new MapImageLayer({ //Rivers, Lakes, Ponds, Islands
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Surface_Water/MapServer",
            title: "Rivers, Lakes, Ponds, Islands",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 10
              }
            ]
          }),
          new FeatureLayer({ //Creeks, Under Road Drainage
            url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Surface_Water/MapServer/9",
            title: "Creeks, Under Road Drainage",
            visible: false,
          })
          

        ]
      })
    ]
  });
  //Cemeteries
  const cemeteries = new GroupLayer({
    title: "Cemeteries",
    layers: [
      new GroupLayer({ //International cemetery
        title: "International Cemetery",
        layers: [
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Cemetery_International/MapServer",
            title: "Cemetery Boundary",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 5
              }
            ]
          }),
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Cemetery_International/MapServer",
            title: "Plots",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 4
              }
            ]
          }),
          new MapImageLayer({
            url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Cemetery_International/MapServer",
            title: "Plots Labels",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 3
              }
            ]
          })
        ]
      }),
      new MapImageLayer({ //Cemetery locations
        url: "https://gis.traviscountytx.gov/server1/rest/services/Public_Works/Cemetery_Travis_County_Maintained_Locations/MapServer",
        title: "Cemetery Locations",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      })
    ]
  });
  //Storm Water Management
  const stormWater = new GroupLayer({
    title: "Storm Water Management",
    layers: [
      new GroupLayer({ //Storm Water PWQCs
        title: "Storm Water PWQCs",
        layers: [
          new MapImageLayer({ //Misc PWQC
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_MiscPWQC/MapServer",
            title: "Misc PWQC",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Surface
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_SurfaceVegControl/MapServer",
            title: "Surface",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Vault
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Vault/MapServer",
            title: "Vault",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Biofiltration
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Biofiltration/MapServer",
            title: "Biofiltration",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Pond
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Pond/MapServer",
            title: "Pond",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          })
        ]
      }),
      new GroupLayer({ //Storm Water Drainage Features
        title: "Storm Water Drainage Features",
        layers: [
          new MapImageLayer({ //Channel
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Channel/MapServer",
            title: "Channel",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Bridge
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Bridge/MapServer",
            title: "Bridge",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Sign
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Sign/MapServer",
            title: "Sign",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Storm Inlet
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_StormInlet/MapServer",
            title: "Storm Inlet",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Storm sewer
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_StormSewerManhole/MapServer",
            title: "Storm Sewer",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Closed pipe
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_ClosedPipe/MapServer",
            title: "Closed Pipe",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Culvert
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Culvert/MapServer",
            title: "Culvert",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Outlet
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Outlet/MapServer",
            title: "Outlet",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),
          new MapImageLayer({ //Outfall
            url: "https://gis.traviscountytx.gov/server1/rest/services/MS4/MS4_Outfall/MapServer",
            title: "Outfall",
            visible: false,
            listMode: "hide-children",
            sublayers: [
              {
                id: 0
              }
            ]
          }),

        ]
      })
    ]
  });
  //Parks
  const parks = new GroupLayer({
    title: "Travis County Parks",
    layers: [
      new MapImageLayer({ //park boundaries
        url: "https://gis.traviscountytx.gov/server1/rest/services/Parks/Parks_Public/MapServer",
        title: "Park Boundaries",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      }),
      new MapImageLayer({ // park features
        url: "https://gis.traviscountytx.gov/server1/rest/services/Parks/Park_Features_public/MapServer",
        title: "Park Features",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      }),
      new MapImageLayer({ //park trails and roads
        url: "https://gis.traviscountytx.gov/server1/rest/services/Parks/Park_Trails_and_Roads_public/MapServer",
        title: "Park Trails & Roads",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      }),
      new MapImageLayer({ //park facilities
        url: "https://gis.traviscountytx.gov/server1/rest/services/Parks/Park_Facilities_public/MapServer",
        title: "Park Facilities",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0
          }
        ]
      }),
    ]
    
  });
  //Balcones Canyonlands Preserve
  const bcp = new MapImageLayer({
    url: "https://gis.traviscountytx.gov/server1/rest/services/BCP_BCCP/BalconesCanyonlandsPreserve/MapServer",
    opacity: 0.5,
    listMode: "hide-children",
    title: "Balcones Canyonlands Preserve Parcels",
    visible: false,
    sublayers: [
      {
        id: 0
      }
    ]

  });
  // Endangered Species Habitat
  const habitat = new GroupLayer({
    title: "Endangered Species Habitat",
    layers: [
      new MapImageLayer({ //Golden-cheeked Warbler Habitat
        url: "https://gis.traviscountytx.gov/server1/rest/services/BCP_BCCP/Habitat_areas/MapServer",
        opacity: 0.5,
        listMode: "hide-children",
        title: "Golden-cheeked Warbler Habitat",
        visible: false,
        sublayers: [
          {
            id: 2
          }
        ]  
      }),
      new MapImageLayer({ //Karst
        url: "https://gis.traviscountytx.gov/server1/rest/services/BCP_BCCP/Habitat_areas/MapServer",
        opacity: 1,
        listMode: "hide-children",
        title: "Karst",
        visible: false,
        sublayers: [
          {
            id: 1
          }
        ]  
      }),
      new MapImageLayer({ //Black-capped Vireo Habitat
        url: "https://gis.traviscountytx.gov/server1/rest/services/BCP_BCCP/Habitat_areas/MapServer",
        opacity: 0.5,
        listMode: "hide-children",
        title: "Black-capped Vireo Habitat",
        visible: false,
        sublayers: [
          {
            id: 0
          }
        ]  
      })
    ]
  });
  //Recycling 
  const recycling = new GroupLayer({
    title: "Recycling",
    layers: [
      new MapImageLayer({ //Prescription Drop Off Sites (2017)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Recycling_And_Waste_Reduction_public/MapServer",
        opacity: 1,
        listMode: "hide-children",
        title: "Prescription Drop Off Sites (2017)",
        visible: false,
        sublayers: [
          {
            id: 1
          }
        ]  
      }),
      new MapImageLayer({ //Recycling Facilities
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Recycling_And_Waste_Reduction_public/MapServer",
        opacity: 1,
        listMode: "hide-children",
        title: "Recycling Facilities",
        visible: false,
        sublayers: [
          {
            id: 0
          }
        ]  
      })
    ]
  });
  //Flood Hazard Layer
  const nfhl = new GroupLayer({
    title: "NFHL",
    layers: [
      new MapImageLayer({ //Flood Hazard Zones
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer",
        title: "Flood Hazard Zones",
        visible: false,
        opacity: 0.5,
        listMode: "hide-children",
        sublayers: [
          {
            id: 5,
            labelsVisible: false
          }
        ]
      }),
      new FeatureLayer({ //Letter of Map Revision (LOMR)  
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer/4",
        title: "Letter of Map Revision (LOMR) (Effective Only)",
        visible: false
      }),
      new FeatureLayer({ //Finished Flood Elevation (FFE)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer/3",
        title: "Finished Flood Elevation (FFE)",
        visible: false
      }),
      new MapImageLayer({ //Zone A 100ft Buffer
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer",
        title: "Zone A 100ft Buffer",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 2
          }
        ]
      }),
      new FeatureLayer({ //Base Flood Elevations (BFE)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer/1",
        title: "Base Flood Elevations (BFE)",
        visible: false
      }),
      new MapImageLayer({ //Flood Insurance Rate Map (FIRM)
        url: "https://gis.traviscountytx.gov/server1/rest/services/Natural_Resources/Flood_Hazard_Layer/MapServer",
        title: "Flood Insurance Rate Map (FIRM)",
        visible: false,
        listMode: "hide-children",
        sublayers: [
          {
            id: 0,
            labelsVisible: false
          }
        ]
      }),
    ]
    
  });
  //1 Percent Depth Image
  const depth1 = new MapImageLayer({
    url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
    opacity: 0.5,
    listMode: "hide-children",
    title: "Flood Depth (1%) in feet",
    visible: true,
    sublayers: [
      {
        id: 12
      }
    ]

  });
  //.2 Percent Depth Image
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
  //10 Percent Estimated Flood Extent 
  const extent10 = new MapImageLayer({
    url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
    opacity: 0.5,
    listMode: "hide-children",
    title: "Flood Extent (10%)",
    visible: false,
    sublayers: [
      {
        id: 7
      }
    ]
  });
 //1 and .2 Percent Estimated Flood Extent
  const extent1_02 = new MapImageLayer({
  url: "https://txgeo.usgs.gov/arcgis/rest/services/FEMA_EBFE/EBFE/MapServer",
  opacity: 0.5,
  listMode: "hide-children",
  title: "Flood Extent (1% and 0.2%)",
  visible: false,
  sublayers: [
    {
      id: 8
    }
  ]
  });
  //1 Percent WSEL Image
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
  //.2 Percent WSEL Image
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
  //Travis County layers group
  const referenceLayers = new GroupLayer({
    title: "Travis County Layers",
    listMode: "show", 
    layers: [
      countyBoundary, subdivs, schoolDistricts, jurisdictions, adminBoundaries, nfhl, planning, cemeteries, hydrology, 
      parcels, habitat, bcp, parks, roads, cip, roadProjects, txdot, stormWater, 
      recycling, facilities
    ],
    visible: true,
  });

  //Flood Risk data group
  const floodRiskLayers = new GroupLayer({
    title: "Base Level Engineering",
    layers: [wsel02, wsel1, depth02, depth1, extent1_02, extent10],
    visible: true,
  });
    
  const map = new WebMap({
    basemap: "satellite",
    layers: [countyBoundary, subdivs, schoolDistricts, jurisdictions, adminBoundaries, nfhl, planning, cemeteries, hydrology, 
        parcels, habitat, bcp, parks, roads, cip, roadProjects, txdot, stormWater, 
        recycling, facilities, floodRiskLayers]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 11,
    center: [-97.73556, 30.28820], //center on travis county
    constraints: {
      rotationEnabled: false,
      minZoom: 10,
      maxZoom: 20
    },
    popup: {
      defaultPopupTemplateEnabled: false
    },
    ui: {
      components: ["zoom"]
    }
  });

  view.ui.move("zoom", "top-left");

  const basemaps = new BasemapGallery({
    view: view,
    container: "basemaps-container"
  });

  const searchWidget = new Search({
    view: view,
    container: "search"
  });

  const homeWidget = new Home({
    view: view
  });

  const scaleBar = new ScaleBar({
    view: view,
    style: "line",
    unit: "dual",
  });

  //Measure widgets
  const measurement = new Measurement({
    view: view
  });
  // Set-up event handlers for buttons and click events
  const distanceButton = document.getElementById("distance");
  const areaButton = document.getElementById("area");
  const clearButton = document.getElementById("clear");
  distanceButton.addEventListener("click", () => {
    distanceMeasurement();
  });
  areaButton.addEventListener("click", () => {
    areaMeasurement();
  });
  clearButton.addEventListener("click", () => {
    clearMeasurements();
  });
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

  view.ui.add([
    {
      component: homeWidget,
      position: "top-left",
      index: 0
    }, {
      component: scaleBar,
      position: "bottom-left"
    }, {
      component: measurement,
      position: "top-left"
    }
  ]);

  //Function for adding legend and opacity slider to the layer list
  function defineActions(event) {
      const item = event.item;
      if (item.layer.type != null && item.layer.type != "group" && item.children.length == 0) {
        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [item.layer.opacity],
          visibleElements: {
            labels: true,
            rangeLabels: true
          }
        });
  
        item.panel = {
          content: [slider, "legend"],
          className: "esri-icon-legend",
          title: "Legend",
        };
  
        slider.on("thumb-drag", event => {
          const {value} = event;
          item.layer.opacity = value;
        }); 
      } 
  }

  //Identify grids depth and elevations and show them in a pop up
  let params;
  view.when(() => {
      // executeIdentify() is called each time the view is clicked
      view.on("click", executeIdentify);
      
      // Set the parameters for the identify
      params = new IdentifyParameters({
        geometry: {type: "point"},
        tolerance: 0,
        returnGeometry: true,
        layerOption: "visible",
        width: view.width,
        height: view.height,
      });
  });
  
  function executeIdentify(event) {
      if (event.button === 0) {
      //return visible grid layers ids
      grids = [depth1, depth02, wsel1, wsel02];
      visibleIds = [];
      grids.forEach(grid => {
        if (grid.visible == true) {
          visibleIds.push(grid.allSublayers.items[0].id);
        }
      });
      // Set the geometry to the location of the view click
      params.layerIds = visibleIds;
      params.geometry = event.mapPoint;
      params.mapExtent = view.extent;
      document.getElementById("viewDiv").style.cursor = "wait";
  
      // This function returns a promise that resolves to an array of features
      // A custom popupTemplate is set for each feature based on the layer it
      // originates from
      identify
        .identify(depth1.url, params)
        .then(response => {
          const results = response.results;
  
          return results.map(result => {
            const feature = result.feature;
            const layerName = result.layerName;
            //console.log("feature - ", feature)
            feature.attributes.layerName = layerName;
            
            if (layerName === "1 Percent Depth Image") {
              feature.popupTemplate = {
                // autocasts as new PopupTemplate()
                title: "Flood Depth (1%)",
                content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
              };
            } else if (layerName === ".2 Percent Depth Image") {
              feature.popupTemplate = {
                // autocasts as new PopupTemplate()
                title: "Flood Depth (0.2%)",
                content: Math.round(feature.attributes['Pixel Value']*10)/10 + ' feet' 
              };
            } else if (layerName === "1 Percent WSEL Image") {
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
        console.log(response);
        visibleGrids = [];
        response.forEach(item => {
          if (item.attributes["Pixel Value"] != "NoData" && floodRiskLayers.visible == true) {
            visibleGrids.push(item);
            view.popup.open({
              features: visibleGrids,
              location: event.mapPoint
            });
          }
        }); 
        document.getElementById("viewDiv").style.cursor = "auto";
      }
    }
  }

  view.when(() => {

    const layerList = new LayerList({
      view: view,
      selectionEnabled: true,
      listItemCreatedFunction: defineActions,
      container: "layers-container"
    });

    let activeWidget;

    const handleActionBarClick = ({ target }) => {
      if (target.tagName !== "CALCITE-ACTION") {
        return;
      }

      if (activeWidget) {
        document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
        document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
      }

      const nextWidget = target.dataset.actionId;
      if (nextWidget !== activeWidget) {
        document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
        document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
        activeWidget = nextWidget;
      } else {
        activeWidget = null;
      }
    };

  
    document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);

    let actionBarExpanded = false;

    document.addEventListener("calciteActionBarToggle", () => {
      actionBarExpanded = !actionBarExpanded;
      view.padding = {
        left: actionBarExpanded ? 5 : 5
      };
    });

    document.querySelector("calcite-shell").hidden = false;
    document.querySelector("calcite-loader").active = false;

    let darkLogo = new Image(50, 50);
    let whiteLogo = new Image(50, 50);
    darkLogo = "./images/travis_county_seal-black.png";
    whiteLogo = "./images/white county seal transparent background.png";
    const countyLogo = document.getElementById("countyLogo");
    let toggle = true;
    const toggleThemes = () => {
      //Logo toggle
      toggle = !toggle;
      countyLogo.src = toggle ? whiteLogo : darkLogo;
      // Calcite theme
      document.body.classList.toggle("calcite-theme-light");
      // ArcGIS JSAPI theme
      const light = document.querySelector("#jsapi-theme-light");
      const dark = document.querySelector("#jsapi-theme-dark");
      light.disabled = !light.disabled;
      dark.disabled = !dark.disabled;
    };

    document.querySelector("calcite-switch").addEventListener("calciteSwitchChange", toggleThemes);

  });
  
});

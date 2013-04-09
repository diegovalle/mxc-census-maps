//The map
var mxc;

//return a color scale for the choropleths
var createScale = function(colors, domain, numcol){
    return chroma.scale(colors).domain(domain, numcol);
};

//Color scales borrowed from colorbrewer
var YlOrRd = ["#FFFFCC", "#FFEDA0",
	      "#FED976", "#FEB24C", 
	      "#FD8D3C", "#FC4E2A", 
	      "#E31A1C", "#BD0026", "#800026"],
RdBu = ["#2166AC", "#4393C3", "#92C5DE", "#D1E5F0", "#F7F7F7", "#FDDBC7", 
	"#F4A582", "#D6604D", "#B2182B"];

//The scales for the various maps
var scalePCA = createScale(['#FC8D59', '#FFFFBF', '#91BFDB'],
			   [-125, 125], 9),
scaleAge = createScale(YlOrRd, [18, 46], 9),
scaleHawt = createScale(RdBu, [30, 70], 9),
scaleRel = createScale(YlOrRd, [0, 20], 9),
scaleKids = createScale(YlOrRd,[50, 90], 9),
scaleArea = createScale(YlOrRd, [0, 737], 9 ),
scaleCars = createScale(YlOrRd, [0, 100], 9);

//remember this is a mustache template
var scaleFun = {{scaleFun}};
var varName = "{{varName}}"; 
var title = "{{titleName}}";

//use the appropiate scale from the template
var getColor = function(value) {
    return scaleFun(value);
}



var nokiaStreets = L.tileLayer('http://{s}.maptile.maps.svc.ovi.com/maptiler/v2/maptile/newest/normal.day.grey/{z}/{x}/{y}/256/png8', {
				   attribution: '©2012 Nokia <a href="http://here.net/services/terms" target="_blank">Terms of use</a>'
			       }),
nokiaSat = L.tileLayer('http://{s}.maptile.maps.svc.ovi.com/maptiler/v2/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8', {
			   attribution: '©2012 Nokia <a href="http://here.net/services/terms" target="_blank">Terms of use</a>'
		       })
var map = L.map('map', {center: new L.LatLng(19.45, -99.1), 
                        zoom: 11,
                        layers: [nokiaSat, nokiaStreets]});

var baseMaps = {
    "Satellite": nokiaSat,
    "Streets": nokiaStreets    
};

L.control.layers(baseMaps).addTo(map);

//add a geosearch control
new L.Control.GeoSearch({
			    provider: new L.GeoSearch.Provider.Google()
			}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h1>'+title+'</h1>' + '<div><h4>Total Population</h4>' +  (props ?
										      '' + props.POB1
										      : 'Hover over an AGEB') +
        '</div><div class="pca"><h4><a href="/hoyodemarginacion.html">Margination Index</a> (-125 to 125)</h4>' +  (props ?
														    '' + props.pca 
														    : '&nbsp;') +
        '</div><div class="POB30_R"><h4><a href="/hoyoderucos.html">Median Age</a> </h4>' +  (props ?
											      '' + props.POB30_R
											      : '&nbsp;') +
        '</div><div class="hawt"><h4><a href="/hoyodelobukis.html">Percentage of 18-24 year olds who are women</a> </h4>' +  (props ?
															      '' + props.hawt + "%"
															      : '&nbsp;') +
        '</div><div class="RELIG4_R"><h4><a href="/hoyodesatanas.html">Percent with no religion</a> </h4>' +  (props ?
													       '' + props.RELIG4_R + '%'
													       : '&nbsp;') +
        '</div><div class="kids"><h4><a href="/hoyodemonstruos.html">Percentage over 15 years of age</a> </h4>' +  (props ?
														    '' + props.kids + '%'
														    : '&nbsp;') +
        '</div><div class="den"><h4><a href="/hoyodesardinas.html">Population Density</a> </h4>' +  (props ?
												     '' + props.den  + 'e6 people / degree<sup>2</sup>'
												     : '&nbsp;') +
        '</div><div class="VIV28_R"><h4><a href="/hoyodetrafico.html">Households with vehicles</a> </h4>' +  (props ?
													      '' + props.VIV28_R + '%'
				: '&nbsp;') + '</div>'
    ;
		};

info.addTo(map);


var getStyle = function(feature) {
    return {
        fillColor: getColor(feature.properties[varName]),
        weight: .1,
        opacity: 1,
        color: '#ddd',
        fillOpacity: 0.8
    };
    
};

function highlightFeature(e) {
    var layer = e.target;
    
    layer.setStyle({
        fillColor: 'transparent',
		       weight: .6,
		       color: 'black'
		       
		   });
    
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    mxc.resetStyle(e.target);
    info.update();
}

function onEachFeature(feature, layer) {
    layer.on({
		 mouseover: highlightFeature,
		 mouseout: resetHighlight
	     });
}

$.getJSON('js/mxc.js', function (data) {
	      var mxcGeojson = topojson.object(data, data.objects.mxc);
	      
	      var featureCollection = {
		  "type": "FeatureCollection",
		  "features": []
	      };

	      for (var i = 0; i <  mxcGeojson.geometries.length; i++) {
		  featureCollection.features.push({
						      "type":"Feature",
						      "geometry":  mxcGeojson.geometries[i],
						      "properties":  mxcGeojson.geometries[i].properties
						  });
	      }
	      
	      // mxcLayer.addData(featureCollection);
	      
    mxc = L.geoJson(featureCollection, {
			style: getStyle,
			onEachFeature: onEachFeature
		    }).addTo(map);
	  });


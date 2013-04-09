#!/usr/bin/env node

//the translation strings
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production';

//read the html template
var page = fs.readFileSync('./leaflet.mustache', 'utf-8');

// var context = {scaleFun: "scaleHawt",
// 	   varname: "hawt"};

// var template = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
// var output = template.render(context);
// fs.writeFileSync('./hoyodelobukis.html', output, 'utf-8');


var compileTemplate = function(page, context, fileName) {
    var template = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] });
    var output = template.render(context);
    fs.writeFileSync(fileName + ".html", output, 'utf-8');
};

var createTemplate = function(scaleName, property, title, page, fileName) {
    var context = {scaleFun: scaleName,
		   varName: property,
                   titleName : title};
    compileTemplate(page, context, fileName);
};


createTemplate("scalePCA","pca", "Margination", page, "hoyodemarginacion");

createTemplate("scaleAge", "POB30_R", "Median Age",page, "hoyoderucos");

createTemplate("scaleHawt", "hawt", "Female Percentage",page, "hoyodelobukis");

createTemplate("scaleRel","RELIG4_R", "Percentage with no religion",page, "hoyodesatanas");

createTemplate("scaleKids", "kids", "Percentage older than 14",page, "hoyodemonstruos");

createTemplate("scaleArea", "den", "Population Density",page, "hoyodesardinas");

createTemplate("scaleCars", "VIV28_R", "Percentage with a car",page, "hoyodetrafico");
var fs = require('fs')
    ,path = require('path')
    ,et = require('elementtree')
    ,source, dirname, fileName, isSingleFile, etree;

if(process.argv.length <= 2) {
  console.log("use 'node app.js /path/to/file.bmml' or 'node app.js /path/to/' for the directory of bmml files");
  return false;
}

source = process.argv[2];

if(isBMML(source)) {
  //fetch single file
  dirname = path.dirname(source);
  filename = path.basename(source);
  fs.readdir(dirname,function(err,file){
      fetchText(filename);
  });
} else {
  //fetch multi files
  dirname = source;
  fs.readdir(dirname,function(err,files){
    files.forEach(function(f){
      if(isBMML(f)) {
	fetchText(f);
      }
    })
  })
}

function isBMML(fileName){
  return (fileName.search(/\.bmml$/) >= 0);
}

function delSubFileName(filename) {
   return filename.replace(/bmml$/,"");
}

function fetchText(file){
  var contents = "";
  var textFile = delSubFileName(file) + "txt";
  if(dirname.search(/\/$/) == -1) dirname = dirname + '/';
  fs.readFile(dirname + file,function(err,data){
    etree = et.parse(data.toString());
    textlist = etree.findall("*/control//text");
    for(var i=0;i<textlist.length;i++){
      contents += unescape(textlist[i].text) + "\n";
   }

   fs.writeFile(dirname + textFile,contents,function(err){
     console.log("fetch text from %s to %s",file,textFile);
   });

  });
}

var $ = require('cheerio');
var request = require('request');
var GoogleDrive = require('./lib/google-drive');



var folderId = "0ByYvAjjPTkj3fkxkTW80cHpLaEVBbENDWmh6dHFqSGlqN0VSczBQMDlaak9kcmRmYWtZSXM";
var folderName = "checkin";
var fileName = "testFile.png";

var googleDrive = new GoogleDrive(folderId, folderName, fileName);
googleDrive.write();
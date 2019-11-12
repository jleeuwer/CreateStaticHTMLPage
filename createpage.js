
// I reused : https://www.freecodecamp.org/news/how-to-generate-an-html-table-and-a-pdf-with-node-google-puppeteer-32f94d9e39f6/
// Author : Adeel Imran


const fs = require('fs');
const vFileSystem = require('fs');
const vPath = require('path');


var varr_files = [];

const moveFrom = "/Users/janleeuwerink/stack/Lijsten/Top 2000/test";

// Split up the path, based on the "/"
var varr_path_components = moveFrom.split("/");

// Build paths
var buildPathHtml = require('./buildPaths');
buildPathHtml.voutputFile = varr_path_components.pop();


/**
 * Take an object which has the following model
 * @param {Object} item 
 * @model
 * {
 *   "vFilename": `String`,
 *   "vDir": `String`,
 *   "vBirthtime": `String`,
 *   "vSize": `String`
 * }
 * 
 * @returns {String}
 */
const createRow = (item) => `
  <tr>
    <td><a href="${item.vDir}/${item.vFilename}">${item.vFilename}</a></td>
    <td>${item.vBirthtime}</td>
    <td>${item.vSize}</td>
  </tr>
`;


/**
 * @description Generates an `html` table with all the table rows
 * @param {String} rows
 * @returns {String}
 */
const createTable = (rows) => `
  <table>
    <tr>
        <th>Filename</td>
        <th>Create date</td>
        <th>Size</td>
    </tr>
    ${rows}
  </table>
`;

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table) => `
  <html>
    <head>
      <style>
        table {
          width: 100%;
        }
        tr {
          text-align: left;
          border: 1px solid black;
        }
        th, td {
          padding: 15px;
        }
        tr:nth-child(odd) {
          background: #CCC
        }
        tr:nth-child(even) {
          background: #FFF
        }
        .no-content {
          background-color: red;
        }
        #logo-rij {
          background: white;
        }
      </style>
    </head>
    <body>
      <table>
        <tr id="logo-rij">
          <td width=50%>
            <img src="./public/images/client.png" width=200 heigth=100">
          </td>
          <td width=50%>
            <img src="./public/images/company.png" width=200 heigth=100">
          </td>
        </tr>
      </table>
      ${table}
    </body>
  </html>
`;

// List all files in a directory in Node.js recursively in a synchronous fashion
var ReadDirFiles = function(pdir, pfilelist) {
  files = vFileSystem.readdirSync(pdir,"utf-8");
  filelist = pfilelist;
  files.forEach(function(file) {
    if (vFileSystem.statSync(pdir + '/' + file).isDirectory()) {
      filelist = ReadDirFiles(pdir + '/' + file, filelist);
    }
    else {
      vstats = vFileSystem.statSync(pdir + '/' + file);
      // debug info
      // console.log(vstats);
      filelist.push({vFilename: file, vDir: pdir, vBirthtime: formatDate(vstats.birthtime), vSize: vstats.size});
    }
  });
  return filelist;
};

function formatDate(pdate) {
  var vdate = new Date(pdate),
      vmonth = '' + (vdate.getMonth() + 1),
      vday = '' + vdate.getDate(),
      vyear = vdate.getFullYear();

  if (vmonth.length < 2) 
      vmonth = '0' + vmonth;
  if (vday.length < 2) 
      vday = '0' + vday;

  return [vday, vmonth, vyear].join('-');
}

// console.log(varr_files);

/**
 * @description this method takes in a path as a string & returns true/false
 * as to if the specified file path exists in the system or not.
 * @param {String} filePath 
 * @returns {Boolean}
 */
const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath); // get information of the specified file path.
		return true;
	} catch (error) {
		return false;
	}
};

try {
	/* Check if the file for `html` build exists in system or not */
	if (doesFileExist(buildPathHtml.buildPathHtml())) {
		console.log('Deleting old build file');
		/* If the file exists delete the file from system */
		fs.unlinkSync(buildPathHtml.buildPathHtml());
    }
    // Read files
    varr_files = ReadDirFiles(moveFrom, varr_files);

	/* generate rows */
  const rows = varr_files.map(createRow).join('');
	/* generate table */
	const table = createTable(rows);
	/* generate html */
	const html = createHtml(table);
	/* write the generated html to file */
	console.log(html);
	fs.writeFileSync(buildPathHtml.buildPathHtml(), html);
	console.log('Succesfully created an HTML table');
} catch (error) {
	console.log('Error generating table', error);
}

//  main.js

// var module = require('./module.js');
// module.myvar = 'Hello world';
// module.test();

// Module.js

// module.exports = {
//   test: function() {
//       console.log('var is', this.myvar);
//   }
// };


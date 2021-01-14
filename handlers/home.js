const url = require('url');
const fs = require('fs'); // File System
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable'); // import non built in Node library
const breeds = require ('../data/breeds.json'); // Imported the breeds json so we can use it! 
const cats = require('../data/cats.json');
module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;
  console.log("[home.js 10]home pathname is ", pathname);
  if (pathname === '/' && req.method === 'GET') {
    // Implement the logic for showing the home html view
    let filePath = path.normalize(
      path.join(__dirname, '../views/home/index.html')
    );
    fs.readFile(filePath, (err, data) => {
      if(err) {
        console.log(err);
        res.write(404, {
          "Content-Type": "text/plain"
        });
        res.write(404);
        res.end();
        return
      } 
      res.writeHead(200, {
        "Content-Type": "text/html" 
      });
      res.write(data);
      res.end();
    });
  } else if (pathname === '/cats/add-cat' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
    const index = fs.createReadStream(filePath);
    index.on('data', (data) => {
      console.log("the breeds are currently ", breeds)
      let catBreedPlaceHolder = breeds.map( (breed) => `<option value"${breed}">${breed}</option>`);
      console.log(catBreedPlaceHolder)
      let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceHolder)
                                            //          <option value="Fluffy Cat">Fluffy Cat</option>
      res.write(modifiedData)
    });
    index.on('end', () => {
      res.end();
    })
    index.on('error', (err) => {
      console.log(err);
    })
  } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
    let filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
    const index = fs.createReadStream(filePath);
    index.on('data', (data) => {
      res.write(data);
    });
    index.on('end', () => {
      res.end();
    })
    index.on('error', (err) => {
      console.log(err);
    })
  } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
    // const index = fs.createReadStream(filePath);
      let form = new formidable.IncomingForm();
      //console.log(form);
      form.parse(req, (err, fields, files) => {
        if (err) { // "if" this is true, then run this code...
          console.log(err)
          
          // res.write(404);
          // res.end();
          //return;
          let oldPath = files.upload.path;
          let newPath = path.normalize(path.join(globalPath, "/content/images" + files.upload.name));

          fs.rename(oldPath, newPath, (err)=> {
              if (err) throw err;
              console.log('files was uploaded successfully')
          });
        }
        fs.readFile('.data//cats.json', 'utf8', (err, data) =>{
            let allCats = JSON.parse(data);
            allCats.push({id:CacheStorage.length =1, ...fields, image: files.upload.name});
            let json = json.stringify(allCats);
            fs.writeFile('/data/cats.json', json, () => {
                res.writeHead(202, { location: "/" });
                res.end();
            });
        });
        console.log("the fields are ", fields);
        console.log("the file(s) are ", files)
      });
    // index.on('data', (data) => {
    //   res.write(data);
    // });
    // index.on('end', () => {
    //   res.end();
    // })
    // index.on('error', (err) => {
    //   console.log(err);
    // })
  } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
    let formData = "";
    req.on('data', (data) => {
      //console.log("the breed form data (toString()) is ", data);
      formData += data
      //console.log("the new data is ", formData);
      //console.log('I want the form data to be just "testing"');
      let parsedData = qs.parse(formData);
      //console.log("the parsed data is ", parsedData.breed);
      fs.readFile("./data/breeds.json", 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        //console.log('the raw dataJSON is ', data )
        let currentBreeds = JSON.parse(data);
        currentBreeds.push(parsedData.breed);
        //console.log("the breeds.json parsed data is the varible currentBreeds " ,currentBreeds);
        let updatedBreeds = JSON.stringify(currentBreeds);
        //console.log("JSON updated ready to save updated breeds", updatedBreeds);
        fs.writeFile('./data/breeds.json', updatedBreeds, 'utf-8', (err) => {
          if (err) {
            console.log(err)
          }
          console.log("The breed was uploaded successfully...")
        })
        res.writeHead(301, { location: '/'});
        res.end();
      })
    });
  } else {
    return true;
  }
}
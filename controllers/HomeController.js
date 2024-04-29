const fs = require('fs');
const csvParser = require('csv-parser');
const csvModel = require('../models/csvSchema');
const path = require('path')

module.exports.homePage = async function(req, res){
    try{

        let csvFiles = await csvModel.find({})
        return res.render('home',{
            files : csvFiles,
            title: 'Home',
            })
    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
    
}

module.exports.uploadFile = async function(req, res){
    try{
        if(!req.file || req.file.mimetype !== 'text/csv'){
            return res.status(400).send('File empty/incorrect format');
        }
        results = []
        fs.createReadStream(req.file.path).pipe(csvParser()).on('data',(data)=>{
            results.push(data)
        }).on('end',async ()=>{
            if(req.file){
                let oldPath = req.file.path
                let newPath = path.join(__dirname,'../uploads',req.file.originalname)
                fs.rename(oldPath,newPath,(error)=>{
                    if(error){
                        throw error
                    }
                })
                let csvFile = await csvModel.create({
                    file: req.file.originalname,
                    header: results[0],
                    data: results.slice(1)
                })
                await csvFile.save()
                console.log('file Uploaded')
                return res.redirect('/')
            }else{
                return res.status(400).send('Empty upload');
            }
        })
    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
    
}

module.exports.viewFile = async function(req,res){
    try{
        let csvFile = await csvModel.findById(req.params.id)
        if(!csvFile){
            return res.status(404).send('File not found');
        }
        let uploadPath = path.join(__dirname,'../uploads')
        let fileData = await new Promise((resolve,reject)=>{
            fs.readFile(path.join(uploadPath,csvFile.file),'utf8',(error,data)=>{
                if(error){
                    reject(error)
                }else{
                    let rows = data.trim().split('\n')
                    let headerRow = rows[0].split(',')
                    let dataRows = rows.slice(1).map(row => {
                        let finalData = {}
                        row.split(',').forEach((element,index) => {
                            finalData[headerRow[index]]=element
                        });
                        return finalData
                    })
                    resolve({file: csvFile.file, header: headerRow , data: dataRows })
                }
            })
        })
        res.render('file_view',{
            title: 'View File',
            fileData
        })


    }catch(err){
        console.log(err);
        res.status(500).json( {message: 'Internal server error'} );
    }
}


module.exports.deleteFile = async function (req, res) {
    try {
        // Find the CSV file by ID
        const csvFile = await csvModel.findById(req.params.id);
        if (!csvFile) {
            return res.status(404).send('File not found');
        }

        // Delete the file from the file system
        const filePath = path.join(__dirname, '../uploads', csvFile.file);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Error deleting file from server' });
            }

            // Delete the CSV file record from the database
            await csvModel.findByIdAndDelete(req.params.id);
            console.log('File deleted');
            return res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
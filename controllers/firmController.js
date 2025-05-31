const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // save to uploads
    },
    filename: (req, file, cb) => {
        // Rename the file to avoid duplicates
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

const addFirm = async(req,res)=>{
    try{
        const {firmName,area,category,region,offer} = req.body;

    const image = req.file?req.file.filename:undefined;
    
    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"vendor not found"})
    }

    const firm = new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res.status(200).json({message:"Firm Added Successfully"})
    }catch(error){
        console.error(error);
        res.status(500).json("Internal server error");
    }
}


const deleteFirmsById = async(req,res) => {
    try {
        const firmId = req.params.firmId;
        const deleteProduct = await Firm.findByIdAndDelete(firmId);

        if(!deleteProduct){
            return res.status(404).json({error:"firm not found"})
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {addFirm:[upload.single('image'),addFirm],deleteFirmsById};
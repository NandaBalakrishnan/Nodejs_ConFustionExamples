const mongoose=require('mongoose');
const Schema=mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const Currency=mongoose.Types.Currency;


const leaderSchema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
     image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: 'Chief Epicurious Officer'
    },
    abbr: {
        type: String,
        default: 'CEO'
    },
    description:
    {
        type:String,
        required:true
    },
    featured: {
        type: Boolean,
        default:false      
    }
},
{timestamp:true
});

var Leaders=mongoose.model('Leader',leaderSchema);

module.exports=Leaders;
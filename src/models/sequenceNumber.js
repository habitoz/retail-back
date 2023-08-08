import mongoose, { Schema } from "mongoose";

class SequenceNumber {
    init() {
        const schema = new Schema({  

            date:{
                type:String,
                required:true,
            },
            sequenceFor:{
                type:String,
                required:true,
                enum:['Order','Payment']
            },
            sequence:{
                type:Number,
                required:true
            },
        }, {
            timestamps: true,
            id: true,
            toObject: {
                virtuals: true
            },
            toJSON: {
                virtuals: true
            }
        });
           
        return mongoose.model("SequenceNumber", schema);
    }
    
    getInstance() {
        return mongoose.models['SequenceNumber'] || this.init();
    }
    
}
    
    export default SequenceNumber;
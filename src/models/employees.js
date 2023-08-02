import mongoose, { Schema } from "mongoose";

class EmployeesModel {
    init() {
        const schema = new Schema({  

            full_name:{
                type:String,
                required:true
            },
            phone:String,
            gender:String,
            description:String,
            registeredBy:{
                type:mongoose.Types.ObjectId,
                ref:'User',
                required:true
            },
            status:{
                type:String,
                default:'Active',
                enum:['Active','Inactive']
            }

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
           
        return mongoose.model("Employees", schema);
    }
    
    getInstance() {
        return mongoose.models['Employees'] || this.init();
    }
    
}
    
    export default EmployeesModel;
import mongoose, { Schema } from "mongoose";

class PaymentsModel {
    init() {
        const schema = new Schema({  

            waiter:{
                type:mongoose.Types.ObjectId,
                ref:"Employees",
                required:true,
            },
            transDate:{
                type:String,
                required:true
            },
            trId:{
                type:String,
                required:true
            },
            sqNumber:{
                type:String,
                required:true
            },
            table_no:String,
            total:{
                type:Number,
                min:0,
                required:true
            },
            order_items:[
                {
                    product_id:{
                        type:mongoose.Types.ObjectId,
                        ref:"Products"
                    },
                    qty:{
                        type:Number,
                        min:0
                    },
                    unit_price:{
                        type:Number,
                        min:0
                    }
                }
            ],
            registeredBy:{
                type:mongoose.Types.ObjectId,
                ref:'User',
                required:true
            },
            status:{
                type:String,
                enum:['Active','Void'],
                default:'Active'
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
           
        return mongoose.model("Payments", schema);
    }
    
    getInstance() {
        return mongoose.models['Payments'] || this.init();
    }
    
}
    
    export default PaymentsModel;
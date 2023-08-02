import mongoose, { Schema } from "mongoose";

class OrdersModel {
    init() {
        const schema = new Schema({  

            waiter:{
                type:mongoose.Types.ObjectId,
                ref:"Employees",
                required:true,
            },
            table_no:String,
            transDate:{
                type:String,
                required:true
            },
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
           
        return mongoose.model("Orders", schema);
    }
    
    getInstance() {
        return mongoose.models['Orders'] || this.init();
    }
    
}
    
    export default OrdersModel;
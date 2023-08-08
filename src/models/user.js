import mongoose, { Schema } from "mongoose";
class UserModel {
    init() {
        const schema = new Schema({

            full_name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true
            },
            role: {
                type: String,
                required:true,
                enum: ['manager', 'admin', 'casher']
            },
            photo: String,
            phone:String,
            registeredBy:{
                type:mongoose.Types.ObjectId,
                ref:"User",
            },
            status: {
                type: String,
                default: 'Active',
                enum: ['Active', 'Locked', 'Suspended']
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

        return mongoose.model("User", schema);
    }

    getInstance() {
        return mongoose.models['User'] || this.init();
    }

}

export default UserModel;
import mongoose, { Schema } from "mongoose";
class UserModel {
    init() {
        const schema = new Schema({

            full_name: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true,
                unique: true
            },
            email: {
                type: String
            },
            phone: {
                type: String
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
            no_attempts:{
                type:Number,
                default:0
            },
            photo: String,
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
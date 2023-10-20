import mongoose, { Schema } from "mongoose";

class CategoryModel {
    init() {
        const schema = new Schema({

            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                unique: true,
                required: true
            },
            description: String,
            registeredBy: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                default: "Active",
                enum: ['Active', 'Inactive']
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

        return mongoose.model("Category", schema);
    }

    getInstance() {
        return mongoose.models['Category'] || this.init();
    }

}

export default CategoryModel;
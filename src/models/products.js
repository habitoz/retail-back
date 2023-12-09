import mongoose, { Schema } from "mongoose";

class ProductsModel {
    init() {
        const schema = new Schema({

            name: {
                type: String,
                required: true
            },
            code: {
                type: String,
                required: true
            },
            order: {
                type: Number,
            },
            price: {
                type: Number,
                required: true
            },
            category: {
                type: mongoose.Types.ObjectId,
                ref: 'Category',
                required: true
            },
            isBono: {
                type: Boolean,
                default: false
            },
            bonoPrice: {
                type: Number,
                default: 0
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

        return mongoose.model("Products", schema);
    }

    getInstance() {
        return mongoose.models['Products'] || this.init();
    }

}

export default ProductsModel;
import mongoose, { Schema } from "mongoose";

class BonoModel {
    init() {
        const schema = new Schema({

            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            date: {
                type: String,
                required: true
            },
            totalAmount: {
                type: Number,
                default: 0
            },
            price: {
                type: Number,
                default: 0
            },
            quantity: {
                type: Number,
                default: 0
            },
            returned: {
                type: Number,
                default: 0
            },
            returnedAmount: {
                type: Number,
                default: 0
            },
            waiter: {
                type: mongoose.Types.ObjectId,
                ref: 'Employees',
                required: true
            },
            registeredBy: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            history: [
                {
                    product: {
                        type: mongoose.Types.ObjectId,
                        ref: 'Products',
                    },
                    quantity: {
                        type: Number,
                        default: 0
                    },
                }
            ],
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

        return mongoose.model("Bono", schema);
    }

    getInstance() {
        return mongoose.models['Bono'] || this.init();
    }

}

export default BonoModel;
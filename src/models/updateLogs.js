import mongoose, { Schema } from "mongoose";

class UpdateLogModel {
    init() {
        const schema = new Schema({

            actor: {
                type: mongoose.Types.ObjectId,
                ref: "User"
            },
            actorName: String,
            type: String,
            changes: [{
                field: String,
                oldValue: String,
                newValue: String
            }]

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

        return mongoose.model("UpdateLog", schema);
    }

    getInstance() {
        return mongoose.models['UpdateLog'] || this.init();
    }

}

export default UpdateLogModel;
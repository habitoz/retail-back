import mongoose from "mongoose";
import config from "config";
import seeder from "./dbSeeder";

class Connection {
    constructor() {
        const url = `mongodb://${config.get("db.host")}:${config.get("db.port" )}/${config.get("db.name")}`;
        //const url = `mongodb://${config.get('db.username')}:${config.get('db.password')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`;
        console.log("Establish new connection with db");
        mongoose.Promise = global.Promise;
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useUnifiedTopology", true);
        mongoose.connect(url, async(err) => {
            console.log(err || "connected to db successfully !!");
            if (!err) {
                await seeder();
                console.log("db seeded succesfully ..");
                // credentialsModel.find({}, async(err, docs) => {
                //     if (!err && global.REDIS_SERVICE) {
                //         for (let i = 0; i < docs.length; i++) {
                //             await global.REDIS_SERVICE.setValue(
                //                 "user:" + docs[i]._id,
                //                 docs[i]
                //             );
                //             const test = await global.REDIS_SERVICE.getValue(
                //                 "user:" + docs[i]._id
                //             );
                //         }
                //         console.log("cached");
                //     }
                // });
            } else {
                console.log("failed to reach database ....");
            }
        });
    }
}

export default new Connection();
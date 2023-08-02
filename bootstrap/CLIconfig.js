import CLI from 'prompt';
import mongoose from "mongoose";
//import fs from "fs";
import config from 'config';
class CliConfig {
    constructor() {
        CLI.start();
        console.log('Write your DB Name here to change your Data Base with CLI only once')
        CLI.get((['modelName']), (err, result) => {
            if (err) {
                console.log('some thing went Wrong on changing DB name please restart your app and try again!')
            } else {
                mongoose.disconnect();
                let data = {
                        "logo": "",
                        "Server_Port": 7070,
                        "db": {
                            "name": result.modelName,
                            "port": 27017,
                            "host": "mongodb://127.0.0.1"
                        }
                    }
                    // fs.writeFileSync('../config/default.json', data, {
                    //     encoding: 'utf8'
                    // });
                const dbname = result.modelName;
                const url = `${config.get('db.host')}:${config.get('db.port')}/` + dbname;

                console.log("Establish new connection with url", url);
                mongoose.connect(url, err => {
                    console.log(err || 'connected to db successfully !!');

                });
            }
        });
    }
}
export default new CliConfig();
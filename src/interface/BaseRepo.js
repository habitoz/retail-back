import mongoose from "mongoose";
import UpdateLogsRepo from './updateLogs';

class BaseRepo {
    constructor(model) {
            this.model = model;
            this.getAll = this.getAll.bind(this);
            this.insert = this.insert.bind(this);
            this.update = this.update.bind(this);
            this.delete = this.delete.bind(this);
            this.updateByCondition = this.updateByCondition.bind(this);
            
        }
        /**
         * 
         * @param {Object} query it accepts query keyword and page
         * 
         * @returns {Object} returns statuscode totalpages and data if exists
         */
    async search(query) {
        try {
            const page = query.page ? parseInt(query.page) : 1;
            const limit = 10;
            const startIndex = (page - 1) * limit;

            const total_pages = Math.ceil(
                (await this.model.find({ $text: { $search: query.keyword } }).countDocuments()) / limit
            );

            const items = await this.model.find({ $text: { $search: query.keyword } })
                .select('-updatedAt -__v')
                .limit(limit)
                .skip(startIndex).lean();

            return {
                statusCode: 200,
                error: false,
                items,
                total_pages: total_pages > 1 ? total_pages : 1,
                page,
            };
        } catch (err) {
            return {
                statusCode: 500,
                message: 'something went wrong!!',
                error: true
            };
        }
    }
    async getById(id, query = {}, exclude = []) {
        try {
            let record = await this.model
                .findById(id)
                .select(exclude).lean()
                .exec();
            if (!record)
                return {
                    error: true,
                    statusCode: 404,
                    message: "item not found",
                    item: null,
                };
            else {
                if (query.populate && query.populate.length) {
                    record = await this.model.populate(record, query.populate);
                }
                return {
                    error: false,
                    statusCode: 200,
                    message: "",
                    item: record,
                };
            }
        } catch (err) {
            return {
                error: true,
                statusCode: 500,
                message: "internal server error",
                item: null,
            };
        }
    }
    async getOneByCondition(condition, query = {}, exclude = []) {
        try {
            let record = await this.model
                .findOne(condition)
                .select(exclude).lean()
                .exec();
            if (!record)
                return {
                    error: true,
                    statusCode: 404,
                    message: "item not found",
                    item: null,
                };
            else {
                if (query.populate && query.populate.length) {
                    record = await this.model.populate(record, query.populate);
                }
                return {
                    error: false,
                    statusCode: 200,
                    message: "",
                    item: record,
                };
            }
        } catch (err) {
            return {
                error: true,
                statusCode: 500,
                message: "internal server error",
                item: null,
            };
        }
    }
    async getCompleteData(query, exclude = ['-__v']) {
        const { populate } = query;
        delete query.populate;

        if (query._id) {
            try {
                query._id = new mongoose.mongo.ObjectId(query._id);
            } catch (error) {
                console.log("not able to generate mongoose id with content", query._id);
            }
        }

        try {
            let items = await this.model
                .find(query)
                .sort({ createdAt: -1 })
                .select(exclude).exec();

            if (populate && populate.length) {
                items = await this.model.populate(items, populate);
            }
            return {
                error: false,
                statusCode: 200,
                items
            };
        } catch (errors) {
            return {
                error: true,
                items:[],
                statusCode: 500,
                message: "something went wrong",
            };
        }
    }
    async getAll(query, exclude = '-token -password -updateAt -createdAt -__v') {
        let { page, limit, populate } = query;
        page = page ? parseInt(page) : 1;
        limit = limit ? Number(limit) : 200;
        const startIndex = (page - 1) * limit;
        delete query.page;
        delete query.limit;
        delete query.populate;

        if (query._id) {
            try {
                query._id = new mongoose.mongo.ObjectId(query._id);
            } catch (error) {
                console.log("not able to generate mongoose id with content", query._id);
            }
        }

        try {
            let items = await this.model
                .find(query)
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(limit)
                // .populate(populate,fields)
                .select(exclude).exec();
            const total_pages = Math.ceil(
                (await this.model.find(query).countDocuments()) / limit
            );
            if (populate && populate.length) {
                items = await this.model.populate(items, populate);
            }
            return {
                error: false,
                statusCode: 200,
                items,
                total_pages,
                page
            };
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                message: "something went wrong",
            };
        }
    }
    async checkIfItExists(condition, populate) {
        try {
            let item = await this.model.findOne(condition).lean();
            if (item) {
                if (populate && populate.length) {
                    item = await this.model.populate(item);
                }
                return {
                    isPresent: true,
                    item,
                    statusCode: 200,
                };
            }
            return {
                isPresent: false,
                statusCode: 404,
                item: null,
            };
        } catch (err) {
            return {
                error: true,
                isPresent: false,
                statusCode: 500,
                message: "something went wrong",
            };
        }
    }

    async insert(data) {
        try {
            let item = await this.model.create(data);
            if (item) {
                return {
                    error: false,
                    statusCode: 201,
                    message: "Successfully created",
                    item,
                };
            } else {
                return {
                    error: true,
                    message: "item not found",
                    statusCode: 404,
                    item: null,
                };
            }
        } catch (error) {
            console.log(error)
            return {
                error: true,
                statusCode: 500,
                message: "Not able to create item",
                errors: error,
            };
        }
    }

    async update(id, data) {
        try {
            const item = await this.model.findByIdAndUpdate(id, data, { new: true });
            if (item) {
                return {
                    error: false,
                    statusCode: 202,
                    message: "Successfully Updated",
                    item,
                };
            } else {
                return {
                    error: true,
                    message: "item not found",
                    statusCode: 404,
                    item: null,
                };
            }
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error,
            };
        }
    }

    async delete(id) {
        try {
            const item = await this.model.findByIdAndDelete(id);
            if (!item)
                return {
                    error: true,
                    statusCode: 404,
                    message: "item not found",
                };

            return {
                error: false,
                statusCode: 201,
                message: "Successfully Deleted Item",
                item,
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: error.message || "something went wrong",
            };
        }
    }
    async insertByPush(condition, data) {
        try {
            const record = await this.model.updateOne(
                condition, { $push: data }
            );
            if (record.nModified != 0 || record.upserted) {
                return {
                    error: false,
                    message: "Successfully Updated",
                    statusCode: 200,
                    record,
                };
            } else {
                return {
                    error: true,
                    message: "item not found",
                    statusCode: 404,
                    item: null,
                };
            }
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error,
            };
        }
    }
    async updateByCondition(condition, data) {
        try {
            const record = await this.model.updateOne(
                condition,
                data
            );
            if (record.nModified != 0 || record.upserted) {
                return {
                    error: false,
                    message: "Successfully Updated",
                    statusCode: 200,
                    record,
                };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: "item not found",
                };
            }
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error,
            };
        }
    }
    async deleteByPull(condition, data, select) {
        try {
            const record = await this.model.updateOne(
                condition, { $pull: data },
                select
            );
            if (record.nModified != 0) {
                return {
                    error: false,
                    message: "Successfully Deleted",
                    statusCode: 200,
                    record,
                };
            } else {
                return {
                    error: true,
                    message: "item not found",
                    statusCode: 404,
                    item: null,
                };
            }
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error,
            };
        }
    }
    async updateLogs(schema, user, oldData, data) {
        try {
            const paths = [];
            schema.eachPath((pathname, schematype) => { paths.push(pathname) });
            const changes = [];
            Object.keys(data).forEach(key => {
                changes.push({ field: key, oldValue: oldData[key], newValue: data[key] })
            });
            return await UpdateLogsRepo.insert(user, { changes })
        } catch (err) {
            return {
                error: true
            }
        }
    }
}

export default BaseRepo;
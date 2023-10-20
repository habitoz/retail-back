import Service from './Service';

class CategoryService extends Service {

    constructor(repo) {
        super(repo);
    }

    //write your logic in here
    async addNew(user, data) {
        data.registeredBy = user.id;
        const { isPresent } = await this.repo.checkIfItExists({ code: data.code });
        if (isPresent) return {
            statusCode: 403,
            message: 'Code already taken.'
        }
        return await this.repo.insert(data);
    }
    async updateCategory(user, data, categoryId) {
        const { isPresent } = await this.repo.checkIfItExists({ code: data.code, _id: { "$ne": categoryId } });
        if (isPresent) return {
            statusCode: 403,
            message: 'Code already taken.'
        }
        return await this.repo.update(categoryId, data)
    }
    async getAllActive(query) {
        return await this.repo.getCompleteData({ status: 'Active' });
    }
};

export default CategoryService;
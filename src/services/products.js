import Service from './Service';

class ProductsService extends Service {

    constructor(repo) {
        super(repo);
    }

    async addProduct(user, data) {
        try {
            const { isPresent } = await this.repo.checkIfItExists({ code: data.code });
            if (isPresent) return new this.errorResponse('code already taken.', 403);
            data.registeredBy = user.id;
            const { error } = await this.repo.insert(data);
            return error ? new this.errorResponse() : new this.successResponse({ message: 'product created.' })
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async getCompleteProducts(query) {
        try {
            return await this.repo.getCompleteData(query);
        } catch (err) {
            return new this.errorResponse()
        }
    }
    async migrate() {
        try {
            const { items: products } = await this.repo.getCompleteData({});
            const { items: category } = await this.repo.getAllCategory({});
            for (let i = 0; i < products.length; i++) {
                const itemCat = category.find(cat => cat.name == products[i].description);
                if (itemCat)
                    await this.repo.update(products[i]._id, { category: itemCat._id })
                else {
                    const { item: newCat } = await this.repo.addCategory({ name: products[i].description, code: 'CAT-' + i });
                    category.push(newCat);
                    await this.repo.update(products[i]._id, { category: newCat._id })
                }

            }
            return new this.successResponse()
        } catch (err) {
            return new this.errorResponse()
        }
    }
};

export default ProductsService;
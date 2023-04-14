import mongoose, { Model, Schema } from 'mongoose';

export class BaseRepository<T> {
    protected readonly repositoryModel: Model<T>;

    /**
     * A model based on the given schema. Repository object that abstracts and simplifies database calls.
     */
    constructor(modelName: string, modelSchema: Schema) {
        this.repositoryModel = mongoose.model<T>(modelName, modelSchema);
    }

    /**
     * Query to find single json object of given type `T`
     * Handles promise resolve and rejection generically.
     * @template T
     * @param {T} query json payload to querys
     * @returns {Promise<T>} single json entity
     */
    public findOne(query: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repositoryModel.findOne(query, (error: Error, response: T) => {
                if (error) {
                    reject(error);
                }
                resolve(response);
            });
        });
    }
}

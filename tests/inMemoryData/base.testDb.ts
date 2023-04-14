import mongoose, { Model, Schema } from 'mongoose';

/**
 * Data generation for tests
 */
export class BaseInMemoryData<T> {
    protected readonly repositoryModel: Model<T>;

    /**
     * A model based on the given schema. Repository object that abstracts and simplifies database calls.
     */
    constructor(modelName: string, modelSchema: Schema) {
        this.repositoryModel = mongoose.model<T>(modelName, modelSchema);
    }

    /**
     * Generate a new instance in the in-memory database
     * @template T
     * @param {T} dataModelObject json payload to create a new persistant entity
     * @returns {Promise<T>} single json entity
     */
    public newPersistant<T>(dataModelObject: T): Promise<T> {
        return new Promise((resolve, reject) => {
            this.repositoryModel.create(dataModelObject, (error, createdEntityDocument) => {
                if (error) {
                    reject(error);
                }
                resolve(createdEntityDocument.toObject());
            });
        });
    }
}

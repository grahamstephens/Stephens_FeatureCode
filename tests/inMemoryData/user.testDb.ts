import { UserSchema } from '../../src/models/schemas/user.schema';
import { User } from '../../src/models/user.model';
import { BaseInMemoryData } from './base.testDb';

export class UserInMemoryData extends BaseInMemoryData<User> {
    constructor() {
        super('user', UserSchema);
    }
}

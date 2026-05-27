import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save' as any, async function(this: any) {
    if (!this.isModified('password')) return;
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (err: any) {
        throw err;
    }
});

userSchema.methods.comparePassword = async function(this: any, password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
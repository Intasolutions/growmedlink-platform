import { Schema, Query } from 'mongoose';

export interface SoftDeleteDocument {
  isDeleted?: boolean;
  deletedAt?: Date | null;
  softDelete(): Promise<this>;
  restore(): Promise<this>;
}

export function softDeletePlugin(schema: Schema) {
  // Add soft delete fields to the schema
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  });

  // Middleware function to filter out soft-deleted documents
  const excludeDeleted = function (this: Query<any, any>) {
    const filters = this.getFilter();
    // Allow querying soft-deleted documents explicitly by passing { isDeleted: true } or { isDeleted: { ... } }
    if (filters.isDeleted === undefined) {
      this.where({ isDeleted: { $ne: true } });
    }
  };

  // Register query hooks
  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('updateMany', excludeDeleted);
  schema.pre('updateOne', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);

  // Add instance methods
  schema.methods.softDelete = async function () {
    this.isDeleted = true;
    this.deletedAt = new Date();
    return this.save();
  };

  schema.methods.restore = async function () {
    this.isDeleted = false;
    this.deletedAt = null;
    return this.save();
  };
}
export default softDeletePlugin;

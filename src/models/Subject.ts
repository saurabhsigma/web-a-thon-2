import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#6366F1',
    },
    icon: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

SubjectSchema.index({ classId: 1, teacherId: 1 });

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

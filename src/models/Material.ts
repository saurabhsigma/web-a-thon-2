import mongoose, { Schema, Document } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  type: 'pdf' | 'video' | 'image' | 'link' | 'other';
  url: string;
  thumbnail?: string;
  description?: string;
  subjectId: mongoose.Types.ObjectId;
  sessionId?: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileSize?: number;
  duration?: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['pdf', 'video', 'image', 'link', 'other'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileSize: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

MaterialSchema.index({ subjectId: 1, createdAt: -1 });
MaterialSchema.index({ sessionId: 1 });

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);

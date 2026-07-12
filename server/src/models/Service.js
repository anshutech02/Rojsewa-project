import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: 100,
  },
  serviceArea: {
    city: { type: String, default: '' },
    radius: { type: Number, default: 10 },
    pincode: { type: String, default: '' },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  priceType: {
    type: String,
    enum: ['fixed', 'hourly', 'starting_from'],
    default: 'fixed',
  },
  duration: {
    type: Number,
    default: 60,
  },
  images: [{
    type: String,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmergency: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

serviceSchema.index({ title: 'text', description: 'text', tags: 'text' });
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ 'serviceArea.pincode': 1 });

const Service = mongoose.model('Service', serviceSchema);
export default Service;

import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  skills: [{
    type: String,
    trim: true,
  }],
  bio: {
    type: String,
    maxlength: 500,
    default: '',
  },
  experience: {
    type: Number,
    default: 0,
  },
  documents: [{
    docType: {
      type: String,
      enum: ['aadhaar', 'pan', 'certificate', 'license', 'other'],
    },
    url: String,
    verified: {
      type: Boolean,
      default: false,
    },
  }],
  serviceArea: {
    city: { type: String, default: '' },
    radius: { type: Number, default: 10 },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  availability: {
    days: {
      type: [String],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    },
    startTime: { type: String, default: '09:00' },
    endTime: { type: String, default: '18:00' },
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  completedBookings: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

// Populate user data by default
providerSchema.pre(/^find/, function () {
  this.populate('user', 'name email phone avatar address isVerified');
});

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;

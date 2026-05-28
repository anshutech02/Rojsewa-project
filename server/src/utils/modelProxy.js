import mongoose from 'mongoose';
import { FileModel } from './dbFallback.js';

let mongoConnected = false;

export const setMongoConnected = (status) => {
  mongoConnected = status;
  console.log(`🔌 DB Connection status updated: ${status ? 'MongoDB' : 'Local JSON Fallback'}`);
};

export const getMongoConnected = () => mongoConnected;

export const createModelProxy = (modelName, mongooseSchema) => {
  let mongooseModel;
  try {
    mongooseModel = mongoose.model(modelName, mongooseSchema);
  } catch (e) {
    mongooseModel = mongoose.model(modelName);
  }

  const fileModel = new FileModel(modelName);

  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (mongoConnected) {
        const val = Reflect.get(target, prop);
        if (typeof val === 'function') {
          return val.bind(target);
        }
        return val;
      } else {
        // Fallback mode
        if (prop in fileModel) {
          const value = fileModel[prop];
          if (typeof value === 'function') {
            return value.bind(fileModel);
          }
          return value;
        }
        const val = Reflect.get(target, prop);
        if (typeof val === 'function') {
          return val.bind(target);
        }
        return val;
      }
    }
  });
};

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to load any model data by name in fallback mode
const loadModelData = (modelName) => {
  const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
};

// Resolves references dynamically for fallback mode
const populateDoc = (doc, pathConfig) => {
  if (!doc) return doc;

  // Normalize path configuration (handles string or object config)
  let pathStr = '';
  if (typeof pathConfig === 'string') {
    pathStr = pathConfig;
  } else if (typeof pathConfig === 'object' && pathConfig.path) {
    pathStr = pathConfig.path;
  }

  const parts = pathStr.split('.');
  const currentKey = parts[0];

  if (!currentKey || !doc[currentKey]) return doc;

  const val = doc[currentKey];

  // Helper function to resolve single reference
  const resolveReference = (refId, key) => {
    if (key === 'category') {
      const categories = loadModelData('Category');
      return categories.find(c => c._id === refId) || refId;
    }
    if (key === 'provider') {
      const providers = loadModelData('Provider');
      const provider = providers.find(p => p._id === refId) || refId;
      // Nested populate user inside provider if found
      if (provider && provider.user && typeof provider.user === 'string') {
        const users = loadModelData('User');
        provider.user = users.find(u => u._id === provider.user) || provider.user;
      }
      return provider;
    }
    if (key === 'user' || key === 'customer') {
      const users = loadModelData('User');
      return users.find(u => u._id === refId) || refId;
    }
    if (key === 'service') {
      const services = loadModelData('Service');
      const service = services.find(s => s._id === refId) || refId;
      // Populate category and provider inside service if found
      if (service) {
        if (service.category && typeof service.category === 'string') {
          const categories = loadModelData('Category');
          service.category = categories.find(c => c._id === service.category) || service.category;
        }
        if (service.provider && typeof service.provider === 'string') {
          const providers = loadModelData('Provider');
          const provider = providers.find(p => p._id === service.provider) || service.provider;
          if (provider && provider.user && typeof provider.user === 'string') {
            const users = loadModelData('User');
            provider.user = users.find(u => u._id === provider.user) || provider.user;
          }
          service.provider = provider;
        }
      }
      return service;
    }
    return refId;
  };

  // Resolve array or single value
  if (Array.isArray(val)) {
    doc[currentKey] = val.map(v => (typeof v === 'string' ? resolveReference(v, currentKey) : v));
  } else if (typeof val === 'string') {
    doc[currentKey] = resolveReference(val, currentKey);
  }

  // Recurse nested paths if specified (e.g. pathConfig.populate)
  if (typeof pathConfig === 'object' && pathConfig.populate) {
    if (Array.isArray(doc[currentKey])) {
      doc[currentKey].forEach(subDoc => populateDoc(subDoc, pathConfig.populate));
    } else {
      populateDoc(doc[currentKey], pathConfig.populate);
    }
  }

  return doc;
};

// Chainable and awaitable Query wrapper mimicking Mongoose Query
class MockQuery {
  constructor(promise) {
    this.promise = promise;
    this.populatePaths = [];
  }

  select() {
    return this;
  }

  populate(pathConfig) {
    this.populatePaths.push(pathConfig);
    return this;
  }

  sort(sortOptions) {
    // Basic sorting logic (usually -createdAt)
    if (typeof sortOptions === 'string' && sortOptions.startsWith('-')) {
      const field = sortOptions.substring(1);
      this.promise = this.promise.then(items => {
        if (!Array.isArray(items)) return items;
        return [...items].sort((a, b) => new Date(b[field]) - new Date(a[field]));
      });
    }
    return this;
  }

  limit(count) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      return items.slice(0, count);
    });
    return this;
  }

  // Thenable interface
  then(onFulfilled, onRejected) {
    // Apply all registered populates before resolving
    const executePopulate = async (data) => {
      if (!data) return data;
      if (Array.isArray(data)) {
        for (const item of data) {
          this.populatePaths.forEach(path => populateDoc(item, path));
        }
      } else {
        this.populatePaths.forEach(path => populateDoc(data, path));
      }
      return data;
    };

    return this.promise.then(executePopulate).then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.promise.catch(onRejected);
  }

  finally(onFinally) {
    return this.promise.finally(onFinally);
  }
}

export class FileModel {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Wraps a raw JSON object to emulate Mongoose document methods
  wrapDoc(doc) {
    if (!doc) return null;

    const self = this;
    const wrapped = { ...doc };

    // Standard save method
    wrapped.save = async function() {
      const items = self.read();
      const idx = items.findIndex(item => item._id === wrapped._id);
      
      // If password was updated, hash it before saving (like Mongoose pre-save)
      if (self.name === 'User' && wrapped.password && idx !== -1 && wrapped.password !== items[idx].password) {
        if (!wrapped.password.startsWith('$2a$') && !wrapped.password.startsWith('$2b$')) {
          const salt = await bcrypt.genSalt(12);
          wrapped.password = await bcrypt.hash(wrapped.password, salt);
        }
      }

      if (idx !== -1) {
        items[idx] = { ...wrapped };
        // Clean out helper methods before writing to JSON file
        delete items[idx].save;
        delete items[idx].comparePassword;
        delete items[idx].populate;
        delete items[idx].toJSON;
        delete items[idx].deleteOne;
        self.write(items);
      }
      return self.wrapDoc(wrapped);
    };

    // Standard deleteOne method
    wrapped.deleteOne = async function() {
      const items = self.read();
      const idx = items.findIndex(item => item._id === wrapped._id);
      if (idx !== -1) {
        items.splice(idx, 1);
        self.write(items);
      }
      return { deletedCount: 1 };
    };

    wrapped.populate = function() {
      return this;
    };

    wrapped.toJSON = function() {
      const copy = { ...wrapped };
      delete copy.password;
      delete copy.refreshToken;
      delete copy.save;
      delete copy.comparePassword;
      delete copy.populate;
      delete copy.toJSON;
      delete copy.deleteOne;
      return copy;
    };

    // User-specific document methods
    if (this.name === 'User') {
      wrapped.comparePassword = async function(candidatePassword) {
        return bcrypt.compare(candidatePassword, wrapped.password || '');
      };
    }

    return wrapped;
  }

  find(query = {}) {
    const executeQuery = async () => {
      let items = this.read();
      
      // Apply filters
      if (Object.keys(query).length > 0) {
        items = items.filter(item => {
          for (const key in query) {
            const val = query[key];
            if (typeof val === 'object' && val !== null) {
              if (val.$gte !== undefined && item[key] < val.$gte) return false;
              if (val.$lte !== undefined && item[key] > val.$lte) return false;
              if (val.$in !== undefined && !val.$in.includes(item[key])) return false;
            } else {
              if (item[key] !== val) return false;
            }
          }
          return true;
        });
      }

      // Map to wrapped documents
      return items.map(item => this.wrapDoc(item));
    };

    return new MockQuery(executeQuery());
  }

  findOne(query = {}) {
    const executeQuery = async () => {
      const items = await this.find(query);
      return items[0] || null;
    };

    return new MockQuery(executeQuery());
  }

  findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const items = this.read();
    
    // Hash password if User model
    let finalData = { ...data };
    if (this.name === 'User' && finalData.password) {
      const salt = await bcrypt.genSalt(12);
      finalData.password = await bcrypt.hash(finalData.password, salt);
    }

    const newItem = {
      _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...finalData
    };
    
    items.push(newItem);
    this.write(items);
    return this.wrapDoc(newItem);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const items = this.read();
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;
    
    const updatedItem = {
      ...items[idx],
      ...update,
      updatedAt: new Date().toISOString()
    };
    items[idx] = updatedItem;
    this.write(items);
    return this.wrapDoc(updatedItem);
  }

  async findOneAndUpdate(query, update, options = {}) {
    const items = this.read();
    // Simple filter matching query
    const idx = items.findIndex(item => {
      for (const k in query) {
        if (item[k] !== query[k]) return false;
      }
      return true;
    });

    if (idx === -1) return null;
    return this.findByIdAndUpdate(items[idx]._id, update, options);
  }

  async findByIdAndDelete(id) {
    const items = this.read();
    const idx = items.findIndex(item => item._id === id);
    if (idx === -1) return null;
    const removed = items.splice(idx, 1)[0];
    this.write(items);
    return this.wrapDoc(removed);
  }

  async deleteMany(query = {}) {
    this.write([]);
    return { deletedCount: 0 };
  }

  async insertMany(data) {
    const items = this.read();
    const newItems = data.map(d => ({
      _id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      ...d
    }));
    items.push(...newItems);
    this.write(items);
    return newItems.map(item => this.wrapDoc(item));
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }
}

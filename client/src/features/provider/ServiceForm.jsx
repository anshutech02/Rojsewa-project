import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const ServiceForm = ({ onSubmit, initialData, categories, onCancel, loading }) => {
  const isEdit = !!initialData;
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      priceType: 'fixed',
      duration: 60,
      category: '',
      tags: '',
      images: '',
      isEmergency: false,
    }
  });

  // Populate data in edit mode
  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title || '');
      setValue('description', initialData.description || '');
      setValue('price', initialData.price || '');
      setValue('priceType', initialData.priceType || 'fixed');
      setValue('duration', initialData.duration || 60);
      setValue('category', initialData.category?._id || initialData.category || '');
      setValue('isEmergency', initialData.isEmergency || false);
      setValue('tags', initialData.tags ? initialData.tags.join(', ') : '');
      setValue('images', initialData.images ? initialData.images.join(', ') : '');
    }
  }, [initialData, setValue]);

  const watchedImages = watch('images');

  const onFormSubmit = (data) => {
    const formattedData = {
      ...data,
      price: Number(data.price),
      duration: Number(data.duration),
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      images: data.images ? data.images.split(',').map(i => i.trim()).filter(Boolean) : [],
    };
    onSubmit(formattedData);
  };

  // Helper to split image urls for preview
  const previewImages = watchedImages 
    ? watchedImages.split(',').map(url => url.trim()).filter(url => url.startsWith('http')) 
    : [];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 text-zinc-300">
      <Input
        label="Service Title"
        placeholder="e.g. Professional AC Leak Repair"
        error={errors.title}
        {...register('title', { 
          required: 'Title is required',
          maxLength: { value: 100, message: 'Max 100 characters' }
        })}
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Description
        </label>
        <textarea
          placeholder="Describe your service in detail..."
          rows={4}
          className={`w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 ${
            errors.description ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          {...register('description', { 
            required: 'Description is required',
            maxLength: { value: 1000, message: 'Max 1000 characters' }
          })}
        />
        {errors.description && (
          <p className="text-xs text-red-400 font-medium">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Category
          </label>
          <select
            id="category"
            className={`w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 ${
              errors.category ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            {...register('category', { required: 'Category is required' })}
          >
            <option value="" className="bg-zinc-950">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-zinc-950">
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-400 font-medium">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="priceType" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Price Model
          </label>
          <select
            id="priceType"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
            {...register('priceType')}
          >
            <option value="fixed" className="bg-zinc-950">Fixed Price</option>
            <option value="hourly" className="bg-zinc-950">Hourly Rate</option>
            <option value="starting_from" className="bg-zinc-950">Starting From</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price (₹)"
          type="number"
          placeholder="e.g. 499"
          error={errors.price}
          {...register('price', { 
            required: 'Price is required',
            min: { value: 0, message: 'Price cannot be negative' }
          })}
        />

        <Input
          label="Estimated Duration (minutes)"
          type="number"
          placeholder="e.g. 60"
          error={errors.duration}
          {...register('duration', { 
            required: 'Duration is required',
            min: { value: 5, message: 'Min 5 minutes' }
          })}
        />
      </div>

      <Input
        label="Tags (comma-separated)"
        placeholder="e.g. ac service, cleaning, repairing"
        error={errors.tags}
        {...register('tags')}
      />

      <Input
        label="Image URLs (comma-separated for multiple)"
        placeholder="e.g. https://images.unsplash.com/photo-..."
        error={errors.images}
        {...register('images')}
      />

      {/* Image Preview List */}
      {previewImages.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Image Previews</span>
          <div className="flex gap-2 flex-wrap">
            {previewImages.map((url, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800/60 rounded-xl mt-2">
        <input
          id="isEmergency"
          type="checkbox"
          className="w-4 h-4 text-indigo-600 border-zinc-700 bg-zinc-900 rounded focus:ring-indigo-500 focus:ring-offset-zinc-900"
          {...register('isEmergency')}
        />
        <div className="flex flex-col">
          <label htmlFor="isEmergency" className="text-xs font-bold uppercase tracking-wider text-zinc-300 cursor-pointer">
            Emergency Service Available
          </label>
          <span className="text-[10px] text-zinc-500">Enable this if you can offer instant/urgent deployment.</span>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-800/80 pt-4 mt-4">
        <Button variant="outline" size="md" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={loading}>
          {isEdit ? 'Save Changes' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
};

export default ServiceForm;

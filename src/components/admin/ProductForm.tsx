
import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Product, Category, saveProduct } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { Film, Image, Upload, X } from 'lucide-react';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      price: 0,
      images: ['', '', '', '', '', ''],
      video: '',
      category: ''
    }
  );
  
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null, null]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string[]>(['', '', '', '', '', '']);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null]);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price to convert string to number
    if (name === 'price') {
      const numericValue = parseFloat(value);
      setFormData({ ...formData, [name]: isNaN(numericValue) ? 0 : numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...(formData.images || [])];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };
  
  const handleImageFileChange = async (index: number, file: File | null) => {
    try {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles[index] = file;
      setImageFiles(updatedImageFiles);
      
      const updatedPreviews = [...imagePreview];
      
      if (file) {
        // Create preview
        const preview = URL.createObjectURL(file);
        updatedPreviews[index] = preview;
        
        // Update form data with base64 string
        const base64 = await fileToBase64(file);
        const updatedImages = [...(formData.images || [])];
        updatedImages[index] = base64;
        setFormData({ ...formData, images: updatedImages });
      } else {
        updatedPreviews[index] = '';
      }
      
      setImagePreview(updatedPreviews);
    } catch (error) {
      console.error("Error processing image file:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الصورة",
        variant: "destructive",
      });
    }
  };
  
  const handleVideoFileChange = async (file: File | null) => {
    try {
      setVideoFile(file);
      
      if (file) {
        // Create preview
        const preview = URL.createObjectURL(file);
        setVideoPreview(preview);
        
        // Update form data with base64 string
        const base64 = await fileToBase64(file);
        setFormData({ ...formData, video: base64 });
      } else {
        setVideoPreview('');
      }
    } catch (error) {
      console.error("Error processing video file:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة الفيديو",
        variant: "destructive",
      });
    }
  };
  
  const clearImageFile = (index: number) => {
    handleImageFileChange(index, null);
    // Reset the file input
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = '';
    }
  };
  
  const clearVideoFile = () => {
    handleVideoFileChange(null);
    setFormData({ ...formData, video: '' });
    // Reset the file input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!formData.name || !formData.price || !formData.category) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const filteredImages = formData.images?.filter(img => img.trim() !== '') || [];
      
      if (filteredImages.length === 0) {
        toast({
          title: "خطأ في البيانات",
          description: "يرجى إضافة صورة واحدة على الأقل",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const productToSave = {
        ...formData,
        images: filteredImages,
        video: formData.video?.trim() || undefined,
      } as Product;

      saveProduct(productToSave);
      
      onSave();
      
      toast({
        title: product ? "تم تحديث المنتج" : "تم إضافة المنتج",
        description: product ? "تم تحديث المنتج بنجاح" : "تم إضافة المنتج بنجاح",
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-auto max-h-[90vh]"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 dark:text-gray-200">اسم المنتج</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1 dark:text-gray-200">الفئة</label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 dark:text-gray-200">الوصف</label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1 dark:text-gray-200">السعر (د.ل)</label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price || ''}
                placeholder="0.00"
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="video" className="flex items-center text-sm font-medium mb-1 dark:text-gray-200">
                <Film size={16} className="ml-1" />
                الفيديو (اختياري)
              </label>
              
              <div className="space-y-2">
                {/* Video URL input */}
                <div className="flex items-center gap-2">
                  <input
                    id="video"
                    name="video"
                    type="url"
                    placeholder="أدخل رابط الفيديو (YouTube, Vimeo, إلخ)"
                    value={formData.video && !formData.video.startsWith('data:') ? formData.video : ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={videoFile !== null}
                  />
                  {formData.video && !formData.video.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, video: '' })}
                      className="p-2 text-gray-500 hover:text-red-500"
                      aria-label="Clear video URL"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                
                {/* Video file upload */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="videoFile"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <Upload size={16} />
                      <span>اختر ملف فيديو</span>
                    </label>
                    <input
                      id="videoFile"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      ref={videoInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) handleVideoFileChange(file);
                      }}
                      disabled={formData.video !== '' && !formData.video?.startsWith('data:')}
                    />
                    {videoFile && (
                      <button
                        type="button"
                        onClick={clearVideoFile}
                        className="p-2 text-gray-500 hover:text-red-500"
                        aria-label="Clear video file"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  {/* Video preview */}
                  {videoPreview && (
                    <div className="mt-2 p-2 border dark:border-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">معاينة الفيديو:</p>
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-auto max-h-40 rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-2 dark:text-gray-200">
                <Image size={16} className="ml-1" />
                الصور (حتى 6 صور، الصورة الأولى مطلوبة)
              </label>
              
              <div className="space-y-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex flex-col gap-2">
                      {/* Image URL input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          required={index === 0 && !imageFiles[0]}
                          placeholder={index === 0 ? "رابط الصورة الرئيسية" : `رابط الصورة ${index + 1} (اختياري)`}
                          value={(formData.images && formData.images[index] && !formData.images[index].startsWith('data:')) ? formData.images[index] : ''}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full p-3 border border-gray-200 dark:border-gray-700 dark:bg-white dark:text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          disabled={imageFiles[index] !== null}
                        />
                        {formData.images && formData.images[index] && !formData.images[index].startsWith('data:') && (
                          <button
                            type="button"
                            onClick={() => handleImageChange(index, '')}
                            className="p-2 text-gray-500 hover:text-red-500"
                            aria-label={`Clear image ${index + 1} URL`}
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                      
                      {/* Image file upload */}
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={`imageFile-${index}`}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <Upload size={16} />
                          <span>{index === 0 ? "اختر صورة رئيسية" : `اختر صورة ${index + 1}`}</span>
                        </label>
                        <input
                          id={`imageFile-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          ref={(el) => fileInputRefs.current[index] = el}
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) handleImageFileChange(index, file);
                          }}
                          disabled={formData.images && formData.images[index] && !formData.images[index].startsWith('data:')}
                        />
                        {imageFiles[index] && (
                          <button
                            type="button"
                            onClick={() => clearImageFile(index)}
                            className="p-2 text-gray-500 hover:text-red-500"
                            aria-label={`Clear image ${index + 1} file`}
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Image preview */}
                    {imagePreview[index] && (
                      <div className="mt-1 p-2 border dark:border-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">معاينة الصورة:</p>
                        <img
                          src={imagePreview[index]}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-auto max-h-40 object-contain rounded"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الحفظ...
                  </>
                ) : (
                  product ? 'تحديث المنتج' : 'إضافة المنتج'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;

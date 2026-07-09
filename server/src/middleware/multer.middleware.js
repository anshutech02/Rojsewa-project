import multer from'multer';

const storage = multer.memoryStorage();

const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
        files: 1 // Limit number of files to 1
    },
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Category-specific upload: accepts both 'image' and 'backgroundImage'
export const categoryUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 2
    },
    fileFilter: (req, file, cb) => {
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});


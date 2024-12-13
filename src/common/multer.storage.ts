import { diskStorage } from 'multer';

const storage = diskStorage({
    destination: './uploads', // Folder where files will be temporarily stored
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

export const multerOptions = {
    storage,
};

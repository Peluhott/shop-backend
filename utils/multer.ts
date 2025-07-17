import multer from 'multer'; // understand what this is for better
const storage = multer.diskStorage({})

export const upload = multer({storage})

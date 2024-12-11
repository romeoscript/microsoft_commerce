// utils/middleware.js
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export function multerMiddleware(req, res, next) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error("Form parsing error:", err);
        return reject(new Response(JSON.stringify({ error: 'Form parsing error' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }));
      }
      resolve(next());
    });
  });
}

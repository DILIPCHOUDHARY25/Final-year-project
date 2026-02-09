# Parent OCR Verification System

A system for verifying parent identities using OCR technology to extract phone numbers from government-issued ID cards.

## Features

- **File Upload**: Secure file upload using Multer
- **OCR Processing**: Extract text from ID cards using Tesseract.js
- **Phone Number Extraction**: Regex-based phone number detection
- **Verification Logic**: Compare extracted phone with registered parent phone
- **User Management**: Parent role and verification status tracking

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- Tesseract.js for OCR processing
- JWT for authentication

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS for styling

## Installation

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm start
```

## Environment Variables

Create a `.env` file in the server directory based on `.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parent_verification
JWT_SECRET=your_jwt_secret_here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/verify-parent-id` - Verify parent ID (requires authentication)

## Usage

1. Register as a parent user
2. Login with your credentials
3. Upload a photo of your government-issued ID
4. The system will extract the phone number and verify it against your registered phone
5. Once verified, you'll have access to parent features

## File Upload Requirements

- **File Types**: JPG, JPEG, PNG
- **Max Size**: 5MB (configurable)
- **Content**: Must contain a visible 10-digit phone number

## Development Notes

- Tesseract.js downloads language data on first run (~50MB)
- For production, consider using cloud storage (S3) instead of local filesystem
- Add rate limiting for verification attempts in production
- Implement proper error handling and logging

## License

MIT
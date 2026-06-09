import path from 'path';
import type {UploadedFile, FileArray} from 'express-fileupload';

type HttpError = Error & {statusCode?: number};

const MAX_UPLOAD_BYTES = parseInt(process.env.MAX_UPLOAD_BYTES || `${20 * 1024 * 1024}`, 10);
const SAFE_SEGMENT_RE = /^[A-Za-z0-9._ \-()]+$/;

const uploadMiddlewareOptions = {
  limits: { fileSize: MAX_UPLOAD_BYTES },
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true,
};

function badRequest(message: string, statusCode = 400): HttpError {
  const err: HttpError = new Error(message);
  err.statusCode = statusCode;
  return err;
}

function asSingleFile(files: FileArray | null | undefined, field = 'file') {
  if (!files || !files[field]) {
    throw badRequest('File mancante');
  }
  return Array.isArray(files[field]) ? files[field][0] : files[field];
}

function sanitizeFileName(fileName: string) {
  const baseName = path.basename(`${fileName || ''}`).trim();
  if (!baseName || baseName === '.' || baseName === '..' || baseName.includes('\0')) {
    throw badRequest('Nome file non valido');
  }
  return baseName.replace(/[^\w. -]/g, '_');
}

function validateFile(file: UploadedFile | null | undefined, allowedMimePrefixes: string[] = []) {
  if (!file) {
    throw badRequest('File mancante');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw badRequest('File troppo grande', 413);
  }
  if (allowedMimePrefixes.length && !allowedMimePrefixes.some(prefix => file.mimetype?.startsWith(prefix))) {
    throw badRequest('Tipo file non consentito');
  }
  return {
    file,
    safeName: sanitizeFileName(file.name),
    options: { contentType: file.mimetype || 'application/octet-stream' },
  };
}

function safeStoragePath(...segments: unknown[]) {
  const cleanSegments = segments.flatMap(segment => `${segment || ''}`.split('/')).filter(Boolean);
  if (!cleanSegments.length) {
    throw badRequest('Percorso file non valido');
  }
  for (const segment of cleanSegments) {
    if (segment === '.' || segment === '..' || segment.includes('\\') || !SAFE_SEGMENT_RE.test(segment)) {
      throw badRequest('Percorso file non valido');
    }
  }
  return cleanSegments.join('/');
}

module.exports = {
  uploadMiddlewareOptions,
  asSingleFile,
  validateFile,
  safeStoragePath,
};

const path = require('path');

const MAX_UPLOAD_BYTES = parseInt(process.env.MAX_UPLOAD_BYTES || `${20 * 1024 * 1024}`, 10);
const SAFE_SEGMENT_RE = /^[A-Za-z0-9._ \-()]+$/;

const uploadMiddlewareOptions = {
    limits: { fileSize: MAX_UPLOAD_BYTES },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
};

function asSingleFile(files, field = 'file') {
    if (!files || !files[field]) {
        const err = new Error('File mancante');
        err.statusCode = 400;
        throw err;
    }
    return Array.isArray(files[field]) ? files[field][0] : files[field];
}

function sanitizeFileName(fileName) {
    const baseName = path.basename(`${fileName || ''}`).trim();
    if (!baseName || baseName === '.' || baseName === '..' || baseName.includes('\0')) {
        const err = new Error('Nome file non valido');
        err.statusCode = 400;
        throw err;
    }
    return baseName.replace(/[^\w. -]/g, '_');
}

function validateFile(file, allowedMimePrefixes = []) {
    if (!file) {
        const err = new Error('File mancante');
        err.statusCode = 400;
        throw err;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
        const err = new Error('File troppo grande');
        err.statusCode = 413;
        throw err;
    }
    if (allowedMimePrefixes.length && !allowedMimePrefixes.some(prefix => file.mimetype?.startsWith(prefix))) {
        const err = new Error('Tipo file non consentito');
        err.statusCode = 400;
        throw err;
    }
    return {
        file,
        safeName: sanitizeFileName(file.name),
        options: { contentType: file.mimetype || 'application/octet-stream' },
    };
}

function safeStoragePath(...segments) {
    const cleanSegments = segments.flatMap(segment => `${segment || ''}`.split('/')).filter(Boolean);
    if (!cleanSegments.length) {
        const err = new Error('Percorso file non valido');
        err.statusCode = 400;
        throw err;
    }
    for (const segment of cleanSegments) {
        if (segment === '.' || segment === '..' || segment.includes('\\') || !SAFE_SEGMENT_RE.test(segment)) {
            const err = new Error('Percorso file non valido');
            err.statusCode = 400;
            throw err;
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

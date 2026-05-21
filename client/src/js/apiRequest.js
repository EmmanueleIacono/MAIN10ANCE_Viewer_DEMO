const JSON_CONTENT_TYPE = 'application/json';

function buildRequestOptions(options = {}) {
    const {json, headers = {}, ...fetchOptions} = options;
    const requestHeaders = {...headers};

    if (json !== undefined) {
        requestHeaders['content-type'] = requestHeaders['content-type'] || JSON_CONTENT_TYPE;
        fetchOptions.body = JSON.stringify(json);
    }

    if (fetchOptions.body instanceof FormData) {
        delete requestHeaders['content-type'];
    }

    return {...fetchOptions, headers: requestHeaders};
}

export async function apiRequest(url, options = {}) {
    const {raw = false, fallback, ...requestOptions} = options;
    const response = await fetch(url, buildRequestOptions(requestOptions));

    if (raw) return response;

    if (!response.ok) {
        const message = await response.text().catch(() => response.statusText);
        throw new Error(message || `Richiesta fallita (${response.status})`);
    }

    if (response.status === 204) return null;

    try {
        return await response.json();
    }
    catch(e) {
        if (fallback !== undefined) return fallback;
        throw e;
    }
}

export function jsonHeaders(headers = {}) {
    return {'content-type': JSON_CONTENT_TYPE, ...headers};
}

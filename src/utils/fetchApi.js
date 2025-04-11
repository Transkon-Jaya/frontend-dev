// src/utils/fetchApi.js

export async function fetchApi(endpoint, method = 'GET', body = null, headers = {}) {
  const url = "https://www.transkon-rent.com" + endpoint;

  const options = {
    method,
    headers: { ...headers },
  };

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
      // Do not set Content-Type; browser sets it automatically for FormData
    } else if (typeof body === 'object') {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    } else {
      // fallback for raw strings or other types
      options.body = body;
    }
  }

  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return { status: 'success', message: text };
    }
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

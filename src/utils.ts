async function fetchWithTimeout(url: string, timeout: number = 5000) {
  const controller = new AbortController();
  const signal = controller.signal;
  const fetchPromise = fetch(url, { signal });

  // Timeout logic
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetchPromise;
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export { fetchWithTimeout }
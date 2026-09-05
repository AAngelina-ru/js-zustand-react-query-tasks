const baseUrl = '/api/users';

const request = async (url, options) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
};

export const fetchUsers = () => request(baseUrl);

// BEGIN (write your solution here)

// END

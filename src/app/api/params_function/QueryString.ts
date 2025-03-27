const QueryString = (params: any) => {
  const queryParams: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value && Array.isArray(value)) {
      value.forEach((v: any) => {
        queryParams.push(`${key}=${v}`);
      });
    } else if (value && typeof value === 'string') {
      queryParams.push(`${key}=${value}`);
    } else if (value && typeof value === 'number') {
      queryParams.push(`${key}=${value}`);
    }
  }

  return queryParams.join('&');
};

export default QueryString;
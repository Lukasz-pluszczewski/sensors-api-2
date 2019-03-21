const getApiKeys = prefix => {
  const apiKeys = {};
  Object.keys(process.env).forEach(env => {
    if (env.indexOf(prefix) === 0) {
      apiKeys[env.replace(new RegExp(`^${prefix}`), '')] = process.env[env];
    }
  });
  console.log('Api keys found', apiKeys);

  return apiKeys;
};

export default getApiKeys;

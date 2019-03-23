const getApiKeys = prefix => {
  const apiKeys = {};
  Object.keys(process.env).forEach(env => {
    if (env.indexOf(prefix) === 0) {
      apiKeys[process.env[env]] = env.replace(new RegExp(`^${prefix}`), '');
    }
  });
  console.log('Api keys found', apiKeys);

  return apiKeys;
};

export default getApiKeys;

const getConfigs = () => {
  if (
    process.env.NODE_ENV === 'production' ||
    process.env.USE_CONFIG !== 'development'
  ) {
    return {
      backend_url: 'https://api.snapodcast.com/v0/api',
      graphql_url:
        process.env.USE_CONFIG === 'production-cdn'
          ? 'https://graphql.snapodcast.com'
          : 'https://api.snapodcast.com/v0/api/graphql',
      qiniu_ak: '4mGogia1PY-PXaYvct65vITq9PeZtZXa1qxE5Ce8',
      qiniu_sk: 'J-NECV03NfUfVgrdIfA1jkSoqMf6PS5XauY-BcxN',
      qiniu_url: 'https://storage.snapaper.com',
      stats_url: 'https://analytics.snapodcast.com',
      site_url: 'https://podcast.snapodcast.com',
    };
  }

  return {
    backend_url: 'http://localhost:3333/v0/api',
    graphql_url: 'http://localhost:3333/v0/api/graphql',
    qiniu_ak: '4mGogia1PY-PXaYvct65vITq9PeZtZXa1qxE5Ce8',
    qiniu_sk: 'J-NECV03NfUfVgrdIfA1jkSoqMf6PS5XauY-BcxN',
    qiniu_url: 'https://storage.snapaper.com',
    stats_url: 'http://localhost:4444',
    site_url: 'https://podcast.snapodcast.com',
  };
};

export default getConfigs();

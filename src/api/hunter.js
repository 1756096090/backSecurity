const axios = require('axios');

const fetchDomainInfo = async (domain) => {
  const apiKey = process.env.HUNTER_API_KEY;
  const url = `https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${apiKey}`;

  console.log("🚀 ~ fetchDomainInfo ~ url:", url)
  try {
    const response = await axios.get(url);
    console.log("🚀 ~ fetchDomainInfo ~ response:", response.data.data)
    return response.data.data;
  } catch (error) {
    console.error('Error fetching domain info:', error);
    throw error;
  }
};

module.exports = { fetchDomainInfo };

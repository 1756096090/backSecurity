const ShodanClient = require('shodan-client');

const fetchShodanInfo = async (domain) => {
  const apiKey = process.env.SHODAN_API_KEY;

  try {
    const data = await ShodanClient.search(domain, apiKey);
    return data;
  } catch (error) {
    console.error('Error fetching Shodan info:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchShodanInfo };

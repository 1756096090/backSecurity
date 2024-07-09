const axios = require('axios');

const fetchVirusTotalInfo = async (domain) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  const url = `https://www.virustotal.com/api/v3/domains/${domain}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'x-apikey': apiKey
      }
    });

    const data = response.data.data;

    // Estructura simplificada de activos
    const assets = {
      certificates: [],
      dns_records: [],
      analysis_results: []
    };

    // Certificados HTTPS
    if (data.attributes.last_https_certificate) {
      const cert = data.attributes.last_https_certificate;
      assets.certificates.push({
        name: "Certificado HTTPS",
        description: "Certificado de seguridad que encripta la comunicación",
        valid_from: cert.validity.not_before,
        valid_to: cert.validity.not_after,
        issuer: cert.issuer.O,
        subject: cert.subject.CN,
        encryption: cert.public_key.algorithm,
        thumbprint: cert.thumbprint
      });
    }

    // Registros DNS
    if (data.attributes.last_dns_records) {
      data.attributes.last_dns_records.forEach(record => {
        assets.dns_records.push({
          type: record.type,
          value: record.value || record.address,
          ttl: record.ttl
        });
      });
    }

    // Resultados de análisis
    if (data.attributes.last_analysis_results) {
      const analysisResults = data.attributes.last_analysis_results;
      Object.keys(analysisResults).forEach(engine => {
        const result = analysisResults[engine];
        assets.analysis_results.push({
          engine: engine,
          category: result.category,
          result: result.result
        });
      });
    }

    return { domain: data.id, assets };

  } catch (error) {
    console.error('Error fetching VirusTotal info:', error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = { fetchVirusTotalInfo };

const express = require('express');
const router = express.Router();
const { fetchDomainInfo } = require('../api/hunter');
const {fetchShodanInfo} = require('../api/shodan');
const { fetchVirusTotalInfo } = require('../api/virusTotal');

router.get('/domain-info/:domain', async (req, res) => {
  const { domain } = req.params;

  try {
    const data = await fetchDomainInfo(domain);

    // Separar los datos en categorías
    const mails = data.emails.map(email => ({
      email: email.value,
      name: email.first_name ? `${email.first_name} ${email.last_name}` : null,
    }));

    const servicesAndPrograms = data.technologies;

    const personalWebsites = data.emails.reduce((acc, email) => {
      const personName = email.first_name ? `${email.first_name} ${email.last_name}` : 'Unknown';
      const websites = email.sources
        .filter(source => source.uri.startsWith('http'))
        .map(source => source.uri);

      if (websites.length > 0) {
        acc[personName] = websites;
      }
      return acc;
    }, {});

    const websites = {
      twitter: data.twitter,
      facebook: data.facebook,
      linkedin: data.linkedin,
      instagram: data.instagram,
      youtube: data.youtube,
      personalWebsites: personalWebsites,
    };

    res.json({
      mails,
      servicesAndPrograms,
      websites,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching domain info' });
  }
});

router.get('/shodan-info/:domain', async (req, res) => {
    const { domain } = req.params;
  
    try {
      const data = await fetchShodanInfo(domain);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Shodan info' });
    }
  });



router.get('/virustotal-info/:domain', async (req, res) => {
  const { domain } = req.params;

  try {
    const data = await fetchVirusTotalInfo(domain);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching VirusTotal info' });
  }
});



module.exports = router;

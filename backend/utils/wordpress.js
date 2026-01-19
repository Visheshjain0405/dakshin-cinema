const axios = require('axios');

async function postToWordPress(article) {
    const wpUrl = process.env.WORDPRESS_URL;
    const wpUser = process.env.WORDPRESS_USER;
    const wpPassword = process.env.WORDPRESS_APP_PASSWORD;

    if (!wpUrl || !wpUser || !wpPassword || wpUrl.includes('your-wordpress-site.com')) {
        console.warn('⚠️ WordPress credentials not set. Skipping WP upload.');
        return null;
    }

    try {
        const auth = Buffer.from(`${wpUser}:${wpPassword}`).toString('base64');

        const payload = {
            title: article.newTitle,
            content: article.newContent,
            status: 'draft', // Save as draft in WordPress
            slug: article.seo?.slug,
            // You can add categories and tags here if you map them to IDs
        };

        const response = await axios.post(`${wpUrl}/wp-json/wp/v2/posts`, payload, {
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('❌ WordPress Upload Failed:', error.response?.data || error.message);
        return null;
    }
}

module.exports = { postToWordPress };

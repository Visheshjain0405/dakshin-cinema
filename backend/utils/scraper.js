const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeArticleDetails(url) {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        // TrackTollywood specific selectors
        const fullTitle = $('.tdb-title-text').text().trim();

        const content = [];
        // Target the main article body paragraphs
        $('.td-post-content p, .tdb-block-inner p').each((i, el) => {
            const text = $(el).text().trim();
            // Filter out short fragments or social media call-to-actions
            if (text.length > 30) content.push(text);
        });

        return {
            fullTitle,
            body: content.join('\n\n')
        };
    } catch (error) {
        console.error(`Failed to scrape article: ${url}`);
        return null;
    }
}

module.exports = { scrapeArticleDetails };

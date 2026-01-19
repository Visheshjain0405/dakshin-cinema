const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');
const { scrapeArticleDetails } = require('../utils/scraper');
const { rewriteArticle } = require('../utils/ai');
const { postToWordPress } = require('../utils/wordpress');

async function startTrackTollywoodScraper() {
    try {
        const url = 'https://tracktollywood.com/category/movie-news/';
        const limit = parseInt(process.env.SCRAPE_LIMIT) || 5;

        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        const $ = cheerio.load(data);
        const results = [];

        // Select news blocks from the category page
        const newsBlocks = $('.td-module-container');

        console.log(`Step 1: Found blocks. Processing the latest ${limit}...`);

        for (let i = 0; i < limit; i++) {
            const link = $(newsBlocks[i]).find('h3.entry-title a, .td-module-title a').attr('href');

            if (link) {
                console.log(`Processing [${i + 1}/${limit}]: ${link}`);
                const raw = await scrapeArticleDetails(link);

                if (raw && raw.body) {
                    const rewritten = await rewriteArticle(raw.fullTitle, raw.body);

                    // Check for duplicates before saving
                    const existingArticle = await Article.findOne({ originalUrl: link });

                    if (!existingArticle) {
                        const newArticle = new Article({
                            originalUrl: link,
                            originalTitle: raw.fullTitle,
                            newTitle: rewritten.newTitle,
                            newContent: rewritten.newContent,
                            seo: rewritten.seo,
                            status: 'draft',
                            source: 'TrackTollywood',
                            tokensUsed: rewritten.tokensUsed,
                            estimatedCost: rewritten.estimatedCost,
                            inputTokens: rewritten.inputTokens,
                            outputTokens: rewritten.outputTokens,
                            inputCost: rewritten.inputCost,
                            outputCost: rewritten.outputCost
                        });

                        // Post to WordPress
                        const wpPost = await postToWordPress(rewritten);
                        if (wpPost) {
                            newArticle.wordpressId = wpPost.id;
                            console.log(`📝 Drafted to WordPress: ID ${wpPost.id}`);
                        }

                        await newArticle.save();
                        console.log(`✅ Saved: ${rewritten.newTitle}`);
                    } else {
                        console.log(`⚠️ Duplicate found: ${link}`);
                    }

                    results.push({
                        originalUrl: link,
                        ...rewritten
                    });
                }
            }
        }

        console.log('--- REWRITTEN CONTENT COMPLETED ---');
        console.log(JSON.stringify(results, null, 2));

    } catch (error) {
        console.error('Main Scraper Error:', error.message);
    }
}

exports.triggerScrape = async (req, res) => {
    startTrackTollywoodScraper();
    res.json({ message: 'Scraping started in background' });
};

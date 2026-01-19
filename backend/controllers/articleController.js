const Article = require('../models/Article');

exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getArticleBySlug = async (req, res) => {
    try {
        const article = await Article.findOne({ "seo.slug": req.params.slug });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

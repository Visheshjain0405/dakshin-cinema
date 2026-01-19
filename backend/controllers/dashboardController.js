const Article = require('../models/Article');

exports.getStats = async (req, res) => {
    const totalArticles = await Article.countDocuments();

    const todayArticles = await Article.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    const usage = await Article.aggregate([
        {
            $group: {
                _id: null,
                tokensUsed: { $sum: "$tokensUsed" },
                estimatedCost: { $sum: "$estimatedCost" },
                inputTokens: { $sum: "$inputTokens" },
                outputTokens: { $sum: "$outputTokens" },
                inputCost: { $sum: "$inputCost" },
                outputCost: { $sum: "$outputCost" },
                wordpressSynced: {
                    $sum: {
                        $cond: [{ $ifNull: ["$wordpressId", false] }, 1, 0]
                    }
                }
            }
        }
    ]);

    res.json({
        totalArticles,
        todayArticles,
        wordpressSynced: usage[0]?.wordpressSynced || 0,
        tokensUsed: usage[0]?.tokensUsed || 0,
        estimatedCost: usage[0]?.estimatedCost?.toFixed(4) || 0,
        inputTokens: usage[0]?.inputTokens || 0,
        outputTokens: usage[0]?.outputTokens || 0,
        inputCost: usage[0]?.inputCost?.toFixed(4) || 0,
        outputCost: usage[0]?.outputCost?.toFixed(4) || 0
    });
};

exports.getUsage = async (req, res) => {
    const data = await Article.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                tokens: { $sum: "$tokensUsed" },
                cost: { $sum: "$estimatedCost" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.json(data);
};

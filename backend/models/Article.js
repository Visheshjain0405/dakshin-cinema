const mongoose = require("mongoose");

const SeoSchema = new mongoose.Schema(
  {
    seoTitle: String,
    metaDescription: String,
    focusKeyword: String,
    lsiKeywords: [String],
    slug: String,
    category: String,
    tags: [String],
    newsType: String,
    seoScore: Number
  },
  { _id: false }
);

const ArticleSchema = new mongoose.Schema({
  originalUrl: { type: String, unique: true },
  originalTitle: String,

  newTitle: String,
  newContent: String,

  seo: SeoSchema,

  tokensUsed: { type: Number, default: 0 },
  estimatedCost: { type: Number, default: 0 },

  inputTokens: { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  inputCost: { type: Number, default: 0 },
  outputCost: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["draft", "ready", "published"],
    default: "draft"
  },

  source: { type: String, default: "TrackTollywood" },

  createdAt: { type: Date, default: Date.now },
  wordpressId: { type: Number, default: null }
});

module.exports = mongoose.model("Article", ArticleSchema);

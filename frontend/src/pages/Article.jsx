import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, User, Tag, Globe, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

const API = "http://localhost:5000/api";

export default function Article() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        axios.get(`${API}/articles/${slug}`)
            .then(res => setArticle(res.data))
            .catch(err => {
                console.error("Failed to load article", err);
                setArticle(null);
            });
    }, [slug]);

    if (!article) return <div className="p-12 text-center text-gray-500">Loading article...</div>;

    const seoScore = article.seo?.seoScore || 0;
    const scoreColor = seoScore >= 80 ? 'text-green-600' : seoScore >= 60 ? 'text-yellow-600' : 'text-red-600';
    const scoreBg = seoScore >= 80 ? 'bg-green-100' : seoScore >= 60 ? 'bg-yellow-100' : 'bg-red-100';

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <Link to="/articles" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Articles
                </Link>
                {article.wordpressId && (
                    <a
                        href={`${import.meta.env.VITE_WP_ADMIN_URL || 'http://localhost/wp-admin'}/post.php?post=${article.wordpressId}&action=edit`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary flex items-center gap-2"
                    >
                        <img src="https://s.w.org/style/images/about/WordPress-logotype-wmark.png" alt="WP" className="w-5 h-5 grayscale brightness-200" />
                        Edit in WordPress
                    </a>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-10">
                            <header className="mb-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {article.seo?.category && (
                                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase rounded-full">
                                            {article.seo.category}
                                        </span>
                                    )}
                                    {article.status === 'draft' && (
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold tracking-wide uppercase rounded-full">
                                            Draft
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                                    {article.newTitle}
                                </h1>

                                <div className="flex items-center text-gray-500 text-sm space-x-6 border-b border-gray-100 pb-6">
                                    <div className="flex items-center">
                                        <User size={16} className="mr-2" />
                                        <span>AI Editor</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2" />
                                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </header>

                            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                {article.newContent}
                            </div>
                        </div>
                    </article>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* SEO Scorecard */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-blue-600" />
                            SEO Intelligence
                        </h3>

                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">RankMath Score</span>
                            <span className={`text-xl font-bold ${scoreColor}`}>{seoScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                            <div className={`h-2.5 rounded-full ${seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${seoScore}%` }}></div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1"><CheckCircle2 size={16} className="text-green-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Focus Keyword</p>
                                    <p className="text-sm font-medium text-gray-900">{article.seo?.focusKeyword || 'Not set'}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="mt-1"><CheckCircle2 size={16} className="text-green-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">SEO Title</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{article.seo?.seoTitle}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="mt-1"><CheckCircle2 size={16} className="text-green-500" /></div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Slug</p>
                                    <p className="text-xs font-mono bg-gray-50 px-2 py-1 rounded text-gray-600 break-all">{article.seo?.slug}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meta Data */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Tags & Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.seo?.tags?.map(tag => (
                                <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 text-xs hover:bg-gray-100 border border-gray-200">
                                    <Tag size={12} className="mr-1.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mt-6 mb-4">Cost Analysis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Tokens</p>
                                <p className="font-bold text-gray-900">{article.tokensUsed || 0}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-500">Est. Cost</p>
                                <p className="font-bold text-gray-900">₹{(article.estimatedCost || 0) * 86}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

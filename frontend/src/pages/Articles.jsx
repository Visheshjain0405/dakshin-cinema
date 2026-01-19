import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Eye, Calendar, Tag } from "lucide-react";

const API = "http://localhost:5000/api";

export default function Articles() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`${API}/articles`).then(res => {
            setArticles(res.data);
        });
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and review your generated content.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-600">
                    Total: <span className="text-gray-900 font-bold">{articles.length}</span>
                </div>
            </header>

            <div className="card overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 uppercase text-xs font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">SEO Score</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {articles.map(a => (
                                <tr key={a._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4 max-w-sm">
                                        <div className="font-medium text-gray-900 line-clamp-2">{a.newTitle}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{a.seo?.focusKeyword && `Focus: ${a.seo.focusKeyword}`}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {a.seo?.seoScore ? (
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold
                                                ${a.seo.seoScore >= 80 ? 'bg-green-100 text-green-700' :
                                                    a.seo.seoScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'}`}>
                                                {a.seo.seoScore}
                                            </span>
                                        ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {a.wordpressId && (
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#21759b] text-white text-[10px] font-bold" title="Synced to WordPress">
                                                    W
                                                </span>
                                            )}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${a.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    a.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {a.status || 'Draft'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar size={14} className="mr-2" />
                                            {new Date(a.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/article/${a.seo?.slug || a._id}`}
                                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Article"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {articles.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No articles found. Start scraping to generate content.
                    </div>
                )}
            </div>
        </div>
    );
}

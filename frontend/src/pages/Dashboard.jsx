import { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DollarSign, FileText, Zap, TrendingUp } from "lucide-react";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const API = "http://localhost:5000/api";
const USD_TO_INR = 86;

export default function Dashboard() {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const [stats, setStats] = useState(null);
    const [usage, setUsage] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsReq = axios.get(`${API}/dashboard`, { headers });
                const usageReq = axios.get(`${API}/dashboard/usage`, { headers });

                const [statsRes, usageRes] = await Promise.all([statsReq, usageReq]);
                setStats(statsRes.data);
                setUsage(usageRes.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("token");
                    window.location.reload();
                }
            }
        };
        fetchData();
    }, []);

    if (!stats) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    const formatINR = (usd) => `₹${(usd * USD_TO_INR).toFixed(2)}`;

    const chartData = {
        labels: usage.map(u => u._id),
        datasets: [
            {
                label: "Tokens",
                data: usage.map(u => u.tokens),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true
            },
            {
                label: "Cost (₹)",
                data: usage.map(u => u.cost * USD_TO_INR),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                yAxisID: 'y1',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
        },
        interaction: { mode: 'index', intersect: false },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: { borderDash: [2, 4] },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
            },
        },
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Track your content generation and usage metrics.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Articles"
                    value={stats.totalArticles}
                    icon={<FileText className="text-blue-600" size={24} />}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Today's Articles"
                    value={stats.todayArticles}
                    icon={<Zap className="text-yellow-600" size={24} />}
                    color="bg-yellow-50"
                />
                <StatCard
                    title="WP Synced"
                    value={stats.wordpressSynced}
                    icon={<div className="w-6 h-6 flex items-center justify-center font-bold text-white bg-blue-600 rounded-full text-xs">W</div>}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Total Tokens"
                    value={stats.tokensUsed.toLocaleString()}
                    icon={<TrendingUp className="text-purple-600" size={24} />}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Total Cost"
                    value={formatINR(stats.estimatedCost)}
                    icon={<DollarSign className="text-green-600" size={24} />}
                    color="bg-green-50"
                    trend="+2.5% vs last week"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 card h-96">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Usage Trends</h3>
                    <div className="h-80">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-lg font-semibold mb-6 text-gray-800">Cost Breakdown</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Input Cost</span>
                            <span className="font-bold text-gray-900">{formatINR(stats.inputCost || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Output Cost</span>
                            <span className="font-bold text-gray-900">{formatINR(stats.outputCost || 0)}</span>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 text-center">
                                *Estimates based on Gemini 2.5 Flash pricing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color, trend }) {
    return (
        <div className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
                    {trend && <span className="text-xs text-green-600 font-medium mt-1 block">{trend}</span>}
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

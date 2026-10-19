"use client";

import EarningsChart from "@/components/admin/Earningschart";
import OverviewSection from "@/components/admin/Overviewsection";
import SalesOverviewChart from "@/components/admin/Salesoverviewchart";
import TopProductsChart from "@/components/admin/Topproductschart";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminDashboardOverviewQuery } from "@/redux/features/admin/adminApi";

const AVATAR_A = "/avatars/user-1.jpg";
const AVATAR_B = "/avatars/user-2.jpg";

function DashboardSkeleton() {
    return (
        <div className="space-y-6 p-8" aria-busy="true" aria-label="Loading dashboard overview">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div className="rounded-2xl bg-white p-6" key={index}>
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="mt-3 h-8 w-24" />
                    </div>
                ))}
            </div>

            {Array.from({ length: 2 }).map((_, rowIndex) => (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2" key={rowIndex}>
                    {Array.from({ length: 2 }).map((_, cardIndex) => (
                        <div className="rounded-2xl bg-white p-6" key={cardIndex}>
                            <Skeleton className="mb-6 h-5 w-36" />
                            <div className="grid grid-cols-3 gap-4">
                                {Array.from({ length: 3 }).map((_, statIndex) => (
                                    <div className="space-y-3" key={statIndex}>
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-7 w-16" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                    <div className="rounded-2xl bg-white p-6" key={index}>
                        <div className="mb-6 flex items-center justify-between">
                            <Skeleton className="h-5 w-36" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="mt-4 h-3 w-28" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { data, isLoading, isError, refetch } = useGetAdminDashboardOverviewQuery();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="p-8">
                <div className="rounded-2xl bg-white p-6">
                    <p className="text-sm font-medium text-red-600">
                        Unable to load the dashboard overview.
                    </p>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "GHS",
            maximumFractionDigits: 2,
        }).format(value);

    return (
        <div className="space-y-6 p-8">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6">
                    <p className="text-sm text-gray-500">Active Listings</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatNumber(data.headerStats.activeListings)}
                    </p>
                </div>
                <div className="rounded-2xl bg-white p-6">
                    <p className="text-sm text-gray-500">Total GMV</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {formatCurrency(data.headerStats.totalGmv)}
                    </p>
                </div>
            </div>

            {/* Users overview + Earnings */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <OverviewSection
                    title="User's Overview"
                    totalLabel="Total Users"
                    totalValue={formatNumber(data.usersOverview.total)}
                    newLabel="Today New User's"
                    newValue={formatNumber(data.usersOverview.todayNew)}
                    activeLabel="Active User"
                    activeValue={formatNumber(data.usersOverview.active)}
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
                <EarningsChart
                    data={data.earnings.monthly}
                    timeframe={data.earnings.timeframe}
                />
            </div>

            {/* Sellers overview + Buyers overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <OverviewSection
                    title="Seller's Overview"
                    totalLabel="Total Sellers"
                    totalValue={formatNumber(data.sellersOverview.total)}
                    newLabel="Today New Sellers"
                    newValue={formatNumber(data.sellersOverview.todayNew)}
                    activeLabel="Active Sellers"
                    activeValue={formatNumber(data.sellersOverview.active)}
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
                <OverviewSection
                    title="Buyer's Overview"
                    totalLabel="Total Buyers"
                    totalValue={formatNumber(data.buyersOverview.total)}
                    newLabel="Today New Buyers"
                    newValue={formatNumber(data.buyersOverview.todayNew)}
                    activeLabel="Active Buyers"
                    activeValue={formatNumber(data.buyersOverview.active)}
                    groupAvatarUrls={[AVATAR_A, AVATAR_B]}
                />
            </div>

            {/* Sales + Top products */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SalesOverviewChart
                    data={data.salesOverview.daily}
                    timeframe={data.salesOverview.timeframe}
                />
                <TopProductsChart data={data.topProducts} />
            </div>
        </div>
    );
}
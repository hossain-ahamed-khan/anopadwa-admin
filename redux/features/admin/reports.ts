import { baseApi } from "@/redux/api/baseApi";
import type { AdminListingReport } from "@/redux/features/admin/adminApi";

export type AdminReportsResponse = {
    success: boolean;
    data: {
        reports: AdminListingReport[];
    };
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};

const reportListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getReportListApi: builder.query<
            AdminReportsResponse,
            { page?: number; limit?: number } | void
        >({
            query: ({ page = 1, limit = 20 } = {}) => ({
                url: "/admin/listings/reports",
                method: "GET",
                params: { page, limit },
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useGetReportListApiQuery } = reportListApi;
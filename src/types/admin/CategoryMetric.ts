export interface CategoryMetric {
  categoryId: number;
  categoryType: string;
  count: number;
}

export interface CategoryMetricsResponse {
  categoryMetrics: CategoryMetric[];
}

import { PageHeader } from "@/components/page-header";
import { SeoOptimizer } from "./seo-optimizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin: SEO Optimizer",
  description: "Use AI to optimize your page's meta tags for better SEO.",
};

export default function AdminSeoPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="SEO Meta Tag Optimizer"
        description="Leverage AI to generate SEO-friendly titles and descriptions."
      />
      <SeoOptimizer />
    </div>
  );
}

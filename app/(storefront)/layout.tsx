import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

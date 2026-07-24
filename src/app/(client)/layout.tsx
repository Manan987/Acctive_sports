import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { WhatsAppButton } from "@/components/client/WhatsAppButton";
import { BackToTop } from "@/components/client/BackToTop";
import { AnnouncementBar } from "@/components/client/marketing/AnnouncementBar";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getCategories();
  const navCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    count: c._count.products,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header categories={navCategories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}

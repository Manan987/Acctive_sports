import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { WhatsAppButton } from "@/components/client/WhatsAppButton";
import { BackToTop } from "@/components/client/BackToTop";
import { ScrollProgress } from "@/components/client/ScrollProgress";
import { CartDrawer } from "@/components/client/CartDrawer";
import { AnnouncementBar } from "@/components/client/marketing/AnnouncementBar";
import { LoginModal } from "@/components/client/LoginModal";
import { CustomerProvider } from "@/context/CustomerContext";
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
    <CustomerProvider>
      <div id="top" className="flex min-h-screen flex-col">
        {/* Keyboard users had to tab through the announcement bar, the logo, four
            nav links, the mega-menu and three header buttons on every page before
            reaching the content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-flame-500 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <AnnouncementBar />
        <Header categories={navCategories} />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackToTop />
        {/* Cart drawer — rendered here so it sits on top of everything */}
        <CartDrawer />
        {/* OTP login modal — shown when checkout or any component calls login() */}
        <LoginModal />
      </div>
    </CustomerProvider>
  );
}


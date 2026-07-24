import { Header } from "@/components/client/Header";
import { Footer } from "@/components/client/Footer";
import { WhatsAppButton } from "@/components/client/WhatsAppButton";
import { AnnouncementBar } from "@/components/client/marketing/AnnouncementBar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

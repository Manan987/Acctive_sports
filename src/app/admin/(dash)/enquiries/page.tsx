import { prisma } from "@/lib/prisma";
import { parseArray } from "@/lib/utils";
import { EnquiryList } from "@/components/admin/EnquiryList";

export const dynamic = "force-dynamic";

export default async function AdminEnquiries() {
  // Bounded: the admin list should not try to render every enquiry ever
  // received in one page once this store has real traffic.
  const rows = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const enquiries = rows.map((e) => {
    let items: any[] = [];
    try {
      items = JSON.parse(e.items);
      if (!Array.isArray(items)) items = [];
    } catch {
      items = [];
    }
    return {
      id: e.id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      company: e.company,
      message: e.message,
      status: e.status,
      source: e.source,
      paymentMethod: e.paymentMethod,
      total: e.total,
      customerId: e.customerId,
      items,
      createdAt: e.createdAt.toISOString(),
    };
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-extrabold">
        Enquiries <span className="text-ink-400">({enquiries.length})</span>
      </h1>
      <EnquiryList enquiries={enquiries} />
    </div>
  );
}

import prisma from "@/db";

export default async function Page() {
  const testRecords = await prisma.test.findMany();
  return (
    <div>
      {testRecords.map((rec) => {
        return <div key={rec.id}>{rec.name}</div>;
      })}
    </div>
  );
}

export const dynamic = "force-dynamic";

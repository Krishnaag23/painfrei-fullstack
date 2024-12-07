import { prisma } from "lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId is required" }), { status: 400 });
  }

  console.log('userId:', userId, 'typeof:', typeof userId);
  console.log('Converted userId to BigInt:', BigInt(userId));



  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: BigInt(userId), // Wrap the userId in BigInt
      },
      include: {
        orderItems: true,
      },
    });

    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

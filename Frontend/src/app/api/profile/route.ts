import { prisma } from "lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try{
  await prisma.user.update({
    where: { email: body.email },
    data: {
      name: body.name,
      addresses: {
        create: {
          street: body.street,
          city: body.city,
          state: body.state,
          postalCode: body.postalCode,
          country: body.country,
        },
      },
    },
  });

  return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
}catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
}
}
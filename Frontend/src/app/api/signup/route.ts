import { prisma } from "lib/prisma";
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password } = body;

  // Validate fields
  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return NextResponse.json({ message: 'User created successfully', user }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user. Please try again later.' }, { status: 500 });
  }
}

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
 

const prisma = new PrismaClient();

export async function GET(request){
     
  const cookieStore = await  cookies();
  const token = cookieStore.get('token')?.value 
  if (!token) {
  return new Response(JSON.stringify({ error: 'Token not found' }), { status: 401 })
  } 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(decoded.id);
      const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        gmail: true,
        profileImage: true,
        password: true,
      },
    });
    if(!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });

}



export async function POST(request) {
  const formData = await request.formData();

  const username = formData.get('username');
  const gmail = formData.get('gmail');
  const password = formData.get('password');
  const file = formData.get('file');  

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = Number(decoded.id);

  let imageUrl = null;

  if (file && typeof file.name === 'string') {
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(process.cwd(), 'public/uploads', fileName);

    await fs.promises.writeFile(filePath, buffer);

    imageUrl = `/uploads/${fileName}`;
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        gmail,
        password,
        profileImage: imageUrl ?? undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

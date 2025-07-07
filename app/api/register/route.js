 import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
 
import { NextResponse } from 'next/server';

 const prisma = new PrismaClient();

export async function POST(req)
{
    const data = await req.json();
 
    console.log(data)

   
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Body boşdur" }, { status: 400 });
    }

   

    const result= await prisma.user.create({
        data: {
            username: data.username,
            gmail: data.email,
            password: hashedPassword,
            profileImage: data.profileImage || ""
  
        }
    })

    return NextResponse.json({ data:result }, { status: 201 });

    

}
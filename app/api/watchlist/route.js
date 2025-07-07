import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
 

 const prisma = new PrismaClient();


export async function  GET(req) {
    try{
           const cookieStore = await  cookies();
           const token = cookieStore.get('token')?.value;

            if (!token) {
            return new Response(JSON.stringify({ error: 'Token not found' }), { status: 401 })
            }

           const decoded = jwt.verify(token, process.env.JWT_SECRET)
           const userId =  Number(decoded.id);
        
          const watchlist= await prisma.user.findUnique({
           where: { id: parseInt(userId) },
           select: {
             watchlist: {
               select: {
                 id: true,
                 movieId: true,
               },
             },
           },
         })
     return NextResponse.json(watchlist, { status: 200 });
    }
    catch(error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });

    }
}

 

 
export async function POST(req) {
   
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(decoded.id);
    const body = await req.json();
    const movieId = String(body.movieId);

     const result=await prisma.watchlist.create({
      data: {
        userId: userId,
        movieId: movieId,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: JSON.stringify(err, null, 2) }, { status: 500 });
  }
}


export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(decoded.id);
    const body = await req.json();
    const movieId = String(body.movieId);

    console.log("User ID:", userId);
    console.log("Movie ID:", movieId);

    const result = await prisma.watchlist.deleteMany({
      where: {
        userId: userId,
        movieId: movieId,
      },
    });

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: JSON.stringify(err, null, 2) }, { status: 500 });
  }
}
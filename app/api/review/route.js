import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const prisma= new PrismaClient();
 
export async function POST (req)
{
    const token = req.cookies.get('token')?.value;
   
    const response= await req.json();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
     const decoded = verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
     where: {
     id: decoded.id
     }
    });

    console.log(response.movieId)

    if(!user) return NextResponse.json({ message: "added comment!" }, { status: 401 });


    await prisma.review.create({
    data: {
    text: response.comment,          
    rating: response.rating,         
    movieId: response.movieId,       
    userId: user.id      
  }
});

   return NextResponse.json({Message: "added comment!"},{error: 200})
}



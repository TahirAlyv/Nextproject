import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log("Movie ID:", id);

    const reviews = await prisma.review.findMany({
      where: { movieId: id },
      select: {
        id:true,
        text: true,
        rating: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json({ message: "No reviews found for this movie." }, { status: 404 });
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

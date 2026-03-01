import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request, { params }) {
    const { book_id } = await params;

    try {
        const decodedUrl = Buffer.from(book_id, "base64").toString("ascii");

        if (!decodedUrl.startsWith("https://server.elscione.com")) {
            return NextResponse.json(
                { error: "Invalid download link" },
                { status: 400 },
            );
        }

        return NextResponse.redirect(new URL(decodedUrl));
    } catch (error) {
        console.error("Redirection error:", error);
        return NextResponse.json(
            { error: "Redirection error" },
            { status: 500 },
        );
    }
}

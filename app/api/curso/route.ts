import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course") || "due-diligence";

  const validCourses = ["due-diligence", "arrematacao", "incorporacao"];
  
  if (!validCourses.includes(course)) {
    return new NextResponse("Curso não encontrado", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "private-courses", `${course}.html`);
    const fileContent = fs.readFileSync(filePath, "utf8");

    return new NextResponse(fileContent, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new NextResponse("Erro ao carregar o conteúdo do curso", { status: 500 });
  }
}

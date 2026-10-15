import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

async function loadSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "유효하지 않은 이메일" }, { status: 400 });
  }

  const subscribers = await loadSubscribers();
  if (subscribers.includes(email)) {
    return NextResponse.json({ message: "이미 구독 중입니다" });
  }

  subscribers.push(email);
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2), "utf-8");
  return NextResponse.json({ message: "구독 완료" });
}

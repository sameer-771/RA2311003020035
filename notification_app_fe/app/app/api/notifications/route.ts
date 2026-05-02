import { NextResponse } from "next/server";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZTM0NjNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwNjM1MywiaWF0IjoxNzc3NzA1NDUzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmRkODliODYtM2M4OS00OGE3LWFlNDAtNjFiOGQwNTdmNmYyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FtZWVyIHJhamEgZSIsInN1YiI6ImQ2YTZhZDAwLWU0YjAtNGJmNS04ZTFhLWYwNWM1YWJhNjA0ZSJ9LCJlbWFpbCI6InNlMzQ2M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6InNhbWVlciByYWphIGUiLCJyb2xsTm8iOiJyYTIzMTEwMDMwMjAwMzUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJkNmE2YWQwMC1lNGIwLTRiZjUtOGUxYS1mMDVjNWFiYTYwNGUiLCJjbGllbnRTZWNyZXQiOiJNbUFhRWtncVhVcHFkVGZhIn0.rpJ9DhnOXwONdmUffM7YfeLTny_IefaWCSjBuPpveW8";
const NOTIFICATIONS_URL =
  "http://20.207.122.201/evaluation-service/notifications";

export async function GET() {
  try {
    const res = await fetch(NOTIFICATIONS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
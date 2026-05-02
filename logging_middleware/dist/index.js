const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzZTM0NjNAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzcwMTk5NSwiaWF0IjoxNzc3NzAxMDk1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOTdhMzFhNTctN2JmYy00Y2RhLThjNWItNzdjMjVlZjlhY2ZlIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FtZWVyIHJhamEgZSIsInN1YiI6ImQ2YTZhZDAwLWU0YjAtNGJmNS04ZTFhLWYwNWM1YWJhNjA0ZSJ9LCJlbWFpbCI6InNlMzQ2M0Bzcm1pc3QuZWR1LmluIiwibmFtZSI6InNhbWVlciByYWphIGUiLCJyb2xsTm8iOiJyYTIzMTEwMDMwMjAwMzUiLCJhY2Nlc3NDb2RlIjoiUWticHhIIiwiY2xpZW50SUQiOiJkNmE2YWQwMC1lNGIwLTRiZjUtOGUxYS1mMDVjNWFiYTYwNGUiLCJjbGllbnRTZWNyZXQiOiJNbUFhRWtncVhVcHFkVGZhIn0.tdUHYslFjc6pxur9E6aa1OosCSOdDUCo-CCTshQzgdA";
export async function Log(stack, level, pkg, message) {
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${AUTH_TOKEN}`,
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message,
            }),
        });
        const data = await response.json();
        console.log("Log sent:", data);
    }
    catch (err) {
        console.error("Logging failed:", err);
    }
}

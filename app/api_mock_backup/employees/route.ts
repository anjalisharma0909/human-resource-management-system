import { NextRequest, NextResponse } from "next/server";
import { db, Employee } from "@/utils/db";
import { verifyToken } from "@/utils/auth";

async function checkAuth(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
    
  }

  const token = authHeader.split(" ")[1];
  return await verifyToken(token);
}

export async function GET(req: NextRequest) {
  try {
    const user = await checkAuth(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const search =
      searchParams.get("search")?.toLowerCase() || "";

    const departmentId =
      searchParams.get("departmentId") || "";

    const status =
      searchParams.get("status") || "";

    let results = [...db.employees];

    if (search) {
      results = results.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search) ||
          emp.email.toLowerCase().includes(search) ||
          emp.role.toLowerCase().includes(search) ||
          emp.id.toLowerCase().includes(search)
      );
    }

    if (departmentId) {
      results = results.filter(
        (emp) => emp.departmentId === departmentId
      );
    }

    if (status) {
      results = results.filter(
        (emp) => emp.status === status
      );
    }

    if (user.role === "Employee") {
      const employee = db.employees.find(
        (emp) =>
          emp.email.toLowerCase() ===
          user.email.toLowerCase()
      );

      if (employee) {
        results = [employee];
      } else {
        results = [];
      }
    }

    return NextResponse.json({
      success: true,
      employees: results,
    });
  } catch (error) {
    console.error("GET Employees Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
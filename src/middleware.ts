import { NextRequest } from "next/server";
import { updateSession } from "./auth/utils";

export default async function middleware(req: NextRequest) {
    return await updateSession(req);
}
import jwt from "jsonwebtoken";

import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/DB";

export const POST = async (request: NextRequest) => {
 

  const body = await request.json();
  const { username, password } = body;
  readDB();

  const user = (<Database>DB).users.find(
    (u) => u.username === username && u.password === password
  );

  if(!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect."
      },{status: 400}
    )
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Username or Password is incorrect",
  //   },
  //   { status: 400 }
  // );
  const secret = process.env.JWT_SECRET || "back up";

  const token = jwt.sign(
    { username, role: user.role}, secret, {expiresIn: "8h"}
  );


  return NextResponse.json({ ok: true, token });
};

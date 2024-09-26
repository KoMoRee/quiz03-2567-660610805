import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/DB";
// import { routeModule } from "next/dist/build/templates/pages";

export const GET = async (request: NextRequest) => {
  readDB();
  const param = request.nextUrl.searchParams.get("roomId");
  const room =  (<Database>DB).rooms.find(
    (r)=> r.roomId === param
  ); 

  if(!room){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const ansMessages = (<Database>DB).messages.filter(
    (m) => m.roomId === room.roomId
  );

  return NextResponse.json(
    {
      ok: true,
      message: ansMessages,
    }
  )
 
};

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json();
  const {roomId , messageText} = body;
  const room = (<Database>DB).rooms.find(
    (r)=> r.roomId === roomId
  )

  if(!room){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  
  const messageId = nanoid();
  (<Database>DB).messages.push(
    {roomId: room.roomId, messageId: messageId, messageText: messageText}
  );

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId: messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();
  const {messageId} = body;


  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  readDB();

  const message =  (<Database>DB).messages.find(
    (m)=> m.messageId === messageId
  );

  if(!message){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  (<Database>DB).messages = (<Database>DB).messages.filter(
    (m)=> m.messageId !== messageId
  );
  

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};

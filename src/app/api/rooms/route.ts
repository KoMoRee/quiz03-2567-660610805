import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@lib/DB";

export const GET = async () => {
  readDB();


  return NextResponse.json({
    ok: true,
    rooms: (<Database>DB).rooms,
    totalRooms: (<Database>DB).rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
  readDB();

  const payload = checkToken();

  if(!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  const body = await request.json();
  const { roomName } = body;
  const haveRoom = (<Database>DB).rooms.findIndex(
    (r)=> r.roomName === roomName
  );
  if(haveRoom > -1) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }
  

  const roomId = nanoid();
  (<Database>DB).rooms.push({roomId: roomId, roomName: roomName,})

  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${roomName} has been created`,
    
  });
};

import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await req.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timeStamp = Date.now();
    const sanitizedName = fileName?.replace(/[^a-zA-Z0-9.]/g, "_") || "upload";
    const uniqueFileName = `${userId}/${timeStamp}_${sanitizedName}`;

    const upload = await imageKit.upload({
      file: buffer,
      fileName: uniqueFileName,
      folder: "/projects",
    });

    const thumbNailUrl = imageKit.url({
      src: upload.url,
      transformation: [
        {
          height: 300,
          width: 400,
          cropMode: "maintain_ar",
          quality: 80,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      url: upload.url,
      thumbNailUrl,
      fileId: upload.fileId,
      width: upload.width,
      height: upload.height,
      size: upload.size,
      name: upload.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image", success: false },
      { status: 401 }
    );
  }
}

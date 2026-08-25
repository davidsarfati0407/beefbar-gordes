import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C1A17",
          color: "#B08D57",
          fontSize: 22,
          fontStyle: "italic",
        }}
      >
        B
      </div>
    ),
    size,
  );
}

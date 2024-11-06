import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function Page({ userId, pageId }) {
  useEffect(() => {
    socket.emit("page-change", { userId, pageId });

    return () => {
    };
  }, [userId, pageId]);

  return <div>Page {pageId}</div>;
}

export default Page;

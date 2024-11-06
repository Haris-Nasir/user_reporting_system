import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000");

function Dashboard({page_id}) {
  const [userCount, setUserCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      const response = await axios.get("http://localhost:4000/active-users");
      setUserCount(response.data.active_users);
      const response1 = await axios.get("http://localhost:4000/active-page1-users");
      setPageCount(response1.data.active_users);
    };
    fetchUserCount();

    socket.on("update-user-count", fetchUserCount);

    return () => socket.off("update-user-count");
  }, [page_id]);

  return (
    <div>
      <h1>Active Users: {userCount}</h1>
      <h1>Page 1 Active Users: {pageCount}</h1>
      {/* <h1>Page 2 Active Users: {userCount}</h1> */}
    </div>
  );
}

export default Dashboard;

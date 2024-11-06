import React, { useState } from "react";
import Dashboard from "./Dashboard";
import Page from "./Page";

function App() {
  const [userId] = useState(1); 
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div>
      <Dashboard page_id={currentPage}/>
      <button onClick={() => setCurrentPage(1)}>Go to Page 1</button>
      <button onClick={() => setCurrentPage(2)}>Go to Page 2</button>
      <Page userId={userId} pageId={currentPage} />
    </div>
  );
}

export default App;

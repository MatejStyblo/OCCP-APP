import React, { useEffect, useState } from "react";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${process.env.REACT_APP_URL_TO_SERVER}/settings/user`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        console.log(userData);

        setUser(userData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading user info...</p>;
  }

  return (
    <div className="user-info">
      <h2>Informace o uživateli </h2>
      <p>{user.username}</p>
    </div>
  );
};

export default UserInfo;

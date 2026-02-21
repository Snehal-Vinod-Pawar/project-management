// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import HomePage from "./home/page";

// export default function Home() {
//   const router = useRouter();
//   const [isAuth, setIsAuth] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
//       credentials: "include",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Not logged in");
//         return res.json();
//       })
//       .then(() => {
//         setIsAuth(true);   // logged in
//       })
//       .catch(() => {
//         router.push("/auth/login"); // not logged in
//       })
//       .finally(() => setLoading(false));
//   }, [router]);

//   if (loading) return null; // or loader

//   return isAuth ? <HomePage /> : null;
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then(() => {
        setIsAuth(true);          // user is authenticated
        router.push("/onboarding"); // redirect to onboarding
      })
      .catch(() => {
        setIsAuth(false);        // not authenticated
        router.push("/auth/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return null;

  return null;
}

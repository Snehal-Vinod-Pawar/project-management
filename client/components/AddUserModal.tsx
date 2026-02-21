// "use client";

// import Modal from "@/components/Modal";
// import { useAddUserMutation } from "@/state/api";
// import React, { useState } from "react";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// const CLOUD_NAME = "projectflow";
// const UPLOAD_PRESET = "profile_uploads";

// const ModalNewUser = ({ isOpen, onClose }: Props) => {
//   const [addUser, { isLoading }] = useAddUserMutation();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
// //   const [profilePictureUrl, setProfilePictureUrl] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [profileUrl, setProfileUrl] = useState("");
//   const [addUser] = useAddUserMutation();

//   const uploadImage = async () => {
//     if (!file) return "";

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     const res = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//       { method: "POST", body: formData }
//     );

//     const data = await res.json();
//     return data.secure_url;
//   };

//   const handleSubmit = async () => {
//     if (!username || !email) return;

//     await addUser({
//       username,
//       email,
//       profilePictureUrl: profileUrl.trim() || null,,
//     }).unwrap();

//     onClose();
//     window.location.reload();
//   };

//   const inputStyles =
//     "w-full rounded border border-gray-300 p-2 shadow-sm transition focus:ring-2 focus:ring-blue-500/30 focus:outline-none";

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} name="Add New User">
//       <form
//         className="mt-4 space-y-5"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSubmit();
//         }}
//       >
//         <input
//           className={inputStyles}
//           placeholder="Full Name"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />

//         <input
//           className={inputStyles}
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           className={inputStyles}
//           placeholder="Profile Image URL (optional)"
//           value={profilePictureUrl}
//           onChange={(e) => setProfilePictureUrl(e.target.value)}
//         />

//         <button
//           type="submit"
//           disabled={!username || !email || isLoading}
//           className="mt-4 w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
//         >
//           {isLoading ? "Creating..." : "Create User"}
//         </button>
//       </form>
//     </Modal>
//   );
// }; 



"use client";

import Modal from "@/components/Modal";
import { useAddUserMutation } from "@/state/api";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewUser = ({ isOpen, onClose }: Props) => {
  const [addUser, { isLoading }] = useAddUserMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const handleSubmit = async () => {
    if (!username || !email) return;
    
    try {
      await addUser({
        username,
        email,
        profilePictureUrl: profileUrl.trim() || null,
      }).unwrap();

      onClose();
    } catch (err: any) {
      alert(err?.data?.message || "Failed to create user");
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm transition focus:ring-2 focus:ring-blue-500/30 focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Add New User">
      <form
        className="mt-4 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className={inputStyles}
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={inputStyles}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className={inputStyles}
          placeholder="Profile Image URL (optional)"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
        />

        <button
          type="submit"
          disabled={!username || !email || isLoading}
          className="mt-4 w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewUser;

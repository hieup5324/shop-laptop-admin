"use client";

import { useState } from "react";
import { toast } from "sonner";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate API request to create user (replace with real API call)
    const newUser = { name, email, password };

    // Display success message
    toast.success(`User ${newUser.name} created successfully!`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-1 p-2 bg-gray-100 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 p-2 bg-gray-100 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 p-2 bg-gray-100 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 mt-4 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;

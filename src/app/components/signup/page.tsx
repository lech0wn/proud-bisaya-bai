"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function SignupPage() {
  const [data, setData] = useState<{
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setSuccess(true);
      console.log('Signup successful:', authData);
      
    } catch (error) {
      console.log(error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (success) {
    return (
      <div className="container mx-auto w-[400px] mt-10">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p className="font-bold">Signup successful!</p>
          <p className="text-sm">Please check your email to verify your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-[400px] mt-10">
      <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid mb-4">
        <label className="mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          placeholder="your.email@example.com"
          required
        />
      </div>
      
      <div className="grid mb-4">
        <label className="mb-1 font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          placeholder="Min 6 characters"
          required
        />
      </div>

      <div className="grid mb-4">
        <label className="mb-1 font-medium">First Name</label>
        <input
          type="text"
          name="firstName"
          value={data.firstName}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          placeholder="John"
          required
        />
      </div>

      <div className="grid mb-4">
        <label className="mb-1 font-medium">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={data.lastName}
          onChange={handleChange}
          className="border rounded px-3 py-2"
          placeholder="Doe"
          required
        />
      </div>
      
      <div>
        <button 
          onClick={signup}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
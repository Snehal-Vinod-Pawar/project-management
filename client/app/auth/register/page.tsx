"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            router.push("/");
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Title */}
            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">
                Create your free account
            </h1>
            <p className="text-sm font-semibold text-gray-400 text-center mb-6 p-1">
                No credit card required. Get started in seconds.
            </p>

            {/* OAuth Buttons */}
            <div className="space-y-3">
                <button 
                    onClick={() => window.location.href = `${API_BASE}/auth/google`}
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition"
                >
                    <Image src="/auth/google.svg" alt="Google" width={18} height={18} />
                    <span className="text-sm font-medium">Continue with Google</span>
                </button>

                <button 
                    onClick={() => window.location.href = `${API_BASE}/auth/github`}
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 hover:bg-gray-50 transition"
                >
                    <Image src="/auth/github.svg" alt="GitHub" width={18} height={18} />
                    <span className="text-sm font-medium">Continue with GitHub</span>
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 font-semibold text-xs text-gray-400 tracking-wide">
                    OR CONTINUE WITH EMAIL
                </span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        name="username"
                        placeholder="eg. Jane Doe"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-medium">Work Email</label>
                    <div className="relative mt-1">
                        <input
                            type="email"
                            name="email"
                            placeholder="jane@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                        <span className="absolute right-3 top-2.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#5B8CFF]">
                            <Check size={12} className="text-white" strokeWidth={3} />
                        </span>

                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative mt-1">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Min. 8 characters"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Strength Bar */}
                    <div className="mt-2">
                        <div className="flex gap-1">
                            <div className="h-1 w-1/4 bg-yellow-400 rounded"></div>
                            <div className="h-1 w-1/4 bg-yellow-200 rounded"></div>
                            <div className="h-1 w-1/4 bg-gray-200 rounded"></div>
                            <div className="h-1 w-1/4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                            <span className="text-yellow-500 font-medium">Fair</span>
                            <span className="text-gray-400">Must include a number</span>
                        </div>
                    </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r bg-[#5B8CFF] text-white py-2.5 rounded-lg hover:from-blue-500 hover:bg-[#4F7CFF]transition font-medium flex items-center justify-center gap-2"
                >
                    {loading ? "Creating..." : "Create Account →"}
                </button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center text-gray-500 mt-6">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-blue-600 hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}

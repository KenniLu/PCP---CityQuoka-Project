//signin page for the frontend
"use client"; 

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // don't add simulate API call

        setIsLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <div>
                <h2>
                    Welcome Back
                </h2>
                <p>
                    Sign in to your account
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email address</label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign in'
                        )}
                    </button>
                </div>
            </form>
            <div>
                Don't have an account?{' '}
                <Link href="/signup">
                    Sign up
                </Link>
            </div>
        </div>
    );
}



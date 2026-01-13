import { useState } from 'react';
import { ShoppingBag, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
    onToggleLogin: () => void;
}

export default function Register({ onToggleLogin }: RegisterProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        const { error } = await signUp(fullName, email, password);

        if (error) {
            setError(error.message || 'Failed to create account. Please try again.');
        } else {
            setSuccess(true);
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                onToggleLogin();
            }, 2000);
        }

        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 p-8">
                            <div className="flex items-center justify-center">
                                <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>

                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                            <p className="text-gray-600 mb-6">
                                Your account has been successfully created. You'll be redirected to login shortly.
                            </p>
                            <button
                                onClick={onToggleLogin}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Savory Bites</h1>
                                <p className="text-orange-100 text-xs">Catering Manager</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                            <p className="text-gray-600">Join Savory Bites and start managing orders</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="fullName"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Manager"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="manager@savorybites.com"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-center text-gray-600 text-sm">
                                Already have an account?{' '}
                                <button
                                    onClick={onToggleLogin}
                                    className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-600 text-sm">
                    <p>© 2026 CraveCall. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

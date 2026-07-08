import { signInWithGoogle } from "../firebase/auth";

export default function Login() {
    const handleLogin = async () => {
        await signInWithGoogle();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-center">
                <h1 className="text-3xl font-bold text-white mb-3">
                    Welcome to StudyOS
                </h1>

                <p className="text-slate-400 mb-6">
                    Sign in to continue
                </p>

                <button
                    onClick={handleLogin}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition"
                >
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
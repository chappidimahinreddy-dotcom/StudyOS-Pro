import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import App from "./App";
import Login from "./components/Login";

export default function AuthGate() {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
                Loading StudyOS...
            </div>
        );
    }

    if (!user) {
        return <Login />;
    }

    return <App />;
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../landing.css";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      return setError("All fields are required.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      // On success, redirect to the pairing screen
      navigate("/pair");
    } catch (err) {
      console.error(err);
      let displayError = "Failed to " + (isLogin ? "log in" : "create account") + ". ";
      if (err.code === 'auth/operation-not-allowed') {
         displayError += "Email/Password sign-in is disabled! Go to Firebase Console -> Authentication -> Sign-in Method and turn it on.";
      } else if (err.code === 'auth/email-already-in-use') {
         displayError += "This email is already registered.";
      } else if (err.code === 'auth/invalid-credential') {
         displayError += "Incorrect email or password.";
      } else {
         // Fallback to exactly what Firebase complained about
         displayError += err.message || err.toString();
      }
      setError(displayError);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/pair");
    } catch (err) {
      console.error(err);
      let displayError = "Google Sign-In failed. ";
      if (err.code === 'auth/operation-not-allowed') {
         displayError += "Google Auth is disabled! Go to Firebase Console -> Authentication -> Sign-in Method and enable Google.";
      } else {
         displayError += err.message || err.toString();
      }
      setError(displayError);
    }
    setLoading(false);
  };

  return (
    <div className="pairing-body">
      <div className="pairing-bg-glow"></div>

      <div className="pairing-card">
        <div className="hardware-icon" style={{ color: "var(--text-primary)" }}>
          {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
        </div>

        <h2 style={{ marginBottom: "24px" }}>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        {error && (
          <div style={{ color: "var(--accent-error)", background: "rgba(255,69,58,0.1)", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="pairing-input-group" style={{ marginBottom: "0px" }}>
            <label>Email Address</label>
            <input
              type="email"
              className="pairing-input"
              style={{ textTransform: "none" }}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="pairing-input-group" style={{ marginBottom: "8px" }}>
            <label>Password</label>
            <input
              type="password"
              className="pairing-input"
              style={{ textTransform: "none" }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="pairing-button" 
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
        </div>

        <button 
          className="pairing-retry-btn" 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ width: "100%", marginBottom: "16px", marginTop: "0px", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: "white", color: "black", border: "none" }}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Continue with Google
        </button>

        <button 
          className="pairing-retry-btn" 
          onClick={() => { setIsLogin(!isLogin); setError(""); }}
          style={{ marginTop: "0px" }}
        >
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
}

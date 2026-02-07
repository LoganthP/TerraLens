import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get the hash fragment from the URL
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                const type = hashParams.get('type');

                if (type === 'signup' && accessToken) {
                    // Email verification successful
                    toast.success("Email verified successfully! You can now sign in.");
                    navigate("/auth");
                } else if (accessToken && refreshToken) {
                    // User is already authenticated via the callback
                    toast.success("Authentication successful!");
                    navigate("/");
                } else {
                    // No valid tokens, redirect to auth
                    toast.error("Invalid verification link.");
                    navigate("/auth");
                }
            } catch (error) {
                console.error("Auth callback error:", error);
                toast.error("An error occurred during verification.");
                navigate("/auth");
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground">Verifying your email...</p>
            </div>
        </div>
    );
}

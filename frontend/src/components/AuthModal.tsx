//@ts-nocheck
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

const supabase = createClient(
  "https://xnkhkebtkzadjgrwrmxb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhua2hrZWJ0a3phZGpncndybXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDEyMTcsImV4cCI6MjA1NTgxNzIxN30.M1IDkpgINKMIQStGxmw7xW5Ks-xe1Q8uTgSdWhmrpwo"
);

export const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state change listener specifically for sign-in events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      // Only navigate when a successful sign-in occurs
      if (event === "SIGNED_IN" && session) {
        setIsOpen(false);
        navigate("/settings");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="text-sm font-normal text-default-600 bg-default-100"
      >
        Sign In
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalBody>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={["google", "discord"]}
              redirectTo={window.location.origin + "/settings"}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;

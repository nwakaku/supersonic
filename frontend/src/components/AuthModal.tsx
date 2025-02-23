//@ts-nocheck
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";

const supabase = createClient(
  "https://xnkhkebtkzadjgrwrmxb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhua2hrZWJ0a3phZGpncndybXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDEyMTcsImV4cCI6MjA1NTgxNzIxN30.M1IDkpgINKMIQStGxmw7xW5Ks-xe1Q8uTgSdWhmrpwo"
);

export const AuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (event === "SIGNED_IN" && session) {
        setIsOpen(false);
        await fetchUserProfile(session.user.id);
        navigate("/settings");
      } else if (event === "SIGNED_OUT") {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", userId)
      .single();

    if (data) {
      setUserProfile(data);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (session?.user) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button className="p-0 bg-transparent" radius="full">
            <Avatar
              alt="Profile"
              className="w-8 h-8"
              size="sm"
              src={
                userProfile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${session.user.email}`
              }
            />
            <span className="ml-2 text-sm font-normal text-default-600">
              {userProfile?.username || session.user.email?.split("@")[0]}
            </span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User menu">
          <DropdownItem key="profile" onClick={() => navigate("/dashboard")}>
            Dashboard
          </DropdownItem>
          <DropdownItem key="settings" onClick={() => navigate("/settings")}>
            Settings
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            onClick={handleSignOut}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <>
      <Button
        className="text-sm font-normal text-default-600 bg-default-100"
        onPress={() => setIsOpen(true)}
      >
        Sign In
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalBody>
            <Auth
              appearance={{ theme: ThemeSupa }}
              providers={["google", "discord"]}
              redirectTo={window.location.origin + "/settings"}
              supabaseClient={supabase}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;

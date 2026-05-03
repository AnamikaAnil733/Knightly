import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { socket } from "./Service/Socket";
import { InviteModal } from "./Components/User/Friend/InviteModal";

import axios from "./Service/Api/Axios/Useraxios";
import AppRoutes from "./Routes/AppRoutes";
import FullScreenLoader from "./Components/FullScreenLoader";
import { RootState } from "./Store/Store";
import { setUser, setAuthLoaded } from "./Store/Slices/Auth/UserAuthSlice";
import {
  setAccessToken as setAdminAccessToken,
  setAuthLoaded as setAdminAuthLoaded,
} from "./Store/Slices/Auth/AdminAuthSlice";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // USER AUTH CHECK
        const userRes = await axios.get("/user/profile");
        const userData = userRes.data;
        dispatch(setUser(userData));
        const userId = userData.id || userData._id;
        if (userId) {
          (window as Window & typeof globalThis & { userId?: string }).userId =
            userId;
          // Identify on initial load
          socket.emit("identify", userId);
          console.log(`[Auth] Identified as ${userId}`);

          // Re-identify on automatic reconnection
          socket.on("connect", () => {
            socket.emit("identify", userId);
            console.log("[Socket] Re-identified after reconnection");
          });
        }
      } catch {
        console.log("User not logged in");
      } finally {
        dispatch(setAuthLoaded(true));
      }

      try {
        // ADMIN AUTH CHECK
        const adminToken = localStorage.getItem("adminAccessToken");

        if (adminToken) {
          dispatch(setAdminAccessToken(adminToken));
        }
      } catch {
        console.log("Admin not logged in");
      } finally {
        dispatch(setAdminAuthLoaded(true));
      }
    };

    initAuth();
  }, [dispatch]);

  const userLoaded = useSelector(
    (state: RootState) => state.userAuth.authLoaded,
  );

  const adminLoaded = useSelector(
    (state: RootState) => state.adminAuth.authLoaded,
  );

  const user = useSelector((state: RootState) => state.userAuth.user);

  // Renamed 'invite' to 'inviteData' and added 'showInviteModal'
  const [inviteData, setInviteData] = useState<{
    senderId: string;
    senderName: string;
    gameFormat: string;
    senderIsPublic: boolean;
  } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    socket.on(
      "receive_friend_invite",
      ({ senderId, senderName, gameFormat, senderIsPublic }) => {
        setInviteData({ senderId, senderName, gameFormat, senderIsPublic });
        setShowInviteModal(true);
      },
    );

    socket.on("receive_friend_request", ({ senderName }) => {
      toast.success(`${senderName} sent you a friend request!`, {
        icon: "👤",
        duration: 5000,
      });
    });

    socket.on("invite_failed", (message) => {
      toast.error(message || "Failed to process invitation");
    });

    socket.on("matchFound", ({ gameId, role }) => {
      console.log(`[Socket] Match found! GameId: ${gameId}, Role: ${role}`);
      toast.success("Match Starting!");
      navigate(`/match/${gameId}?role=${role}`);
    });

    return () => {
      socket.off("connect");
      socket.off("matchFound");
      socket.off("receive_friend_invite");
      socket.off("receive_friend_request");
      socket.off("invite_rejected");
    };
  }, [navigate]);

  const handleAcceptInvite = (receiverIsPublic: boolean) => {
    const currentUserId =
      user?.id ||
      (window as Window & typeof globalThis & { userId?: string }).userId;
    if (inviteData && currentUserId) {
      console.log(
        `[Invite] Accepting invite from ${inviteData.senderId} for user ${currentUserId}`,
      );
      socket.emit("accept_friend_invite", {
        senderId: inviteData.senderId,
        recipientId: currentUserId,
        gameFormat: inviteData.gameFormat,
        senderIsPublic: inviteData.senderIsPublic,
        receiverIsPublic, // This now comes from the modal
      });
      setInviteData(null);
      setShowInviteModal(false);
    } else {
      console.error("[Invite] Failed to accept invite - missing user context", {
        inviteData,
        currentUserId,
      });
      toast.error("Could not accept invite. Please try again.");
    }
  };

  const handleRejectInvite = () => {
    if (inviteData) {
      socket.emit("reject_friend_invite", {
        senderId: inviteData.senderId,
      });
      setInviteData(null);
      setShowInviteModal(false);
    }
  };

  if (!userLoaded || !adminLoaded) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <InviteModal
        isOpen={showInviteModal}
        senderId={inviteData?.senderId || ""}
        senderName={inviteData?.senderName || ""}
        gameFormat={inviteData?.gameFormat || ""}
        senderIsPublic={inviteData?.senderIsPublic}
        onClose={() => {
          setInviteData(null);
          setShowInviteModal(false);
        }}
        onAccept={(receiverIsPublic: boolean) =>
          handleAcceptInvite(receiverIsPublic)
        }
        onReject={handleRejectInvite}
      />
      <AppRoutes />
    </>
  );
}

export default App;

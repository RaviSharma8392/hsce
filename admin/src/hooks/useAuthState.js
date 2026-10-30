import { useEffect, useState, useCallback } from "react";
import { getLazyAuth, getLazyFirestore } from "../config/firebaseLazy";

export const SUPER_ADMIN_EMAIL = "sharmaravi8392@gmail.com";

export function normalizePermissions(permissions = {}) {
  return {
    ...permissions,
    chatbotEnquiries:
      permissions.chatbotEnquiries ?? permissions.enquiries ?? false,
    grievances: permissions.grievances ?? permissions.feedback ?? false,
    faculty: permissions.faculty ?? false,
  };
}

export function useAuthState() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [adminRecord, setAdminRecord] = useState(null);

  const checkUserAuthorization = useCallback(async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setRole(null);
      setPermissions({});
      setAdminRecord(null);
      setLoading(false);
      return;
    }

    setUser(currentUser);
    const normalizedEmail = (currentUser.email || "").trim().toLowerCase();

    // 1. Super Administrator (Principal Ravi Sharma) has automatic full master access
    if (normalizedEmail === SUPER_ADMIN_EMAIL) {
      const superPermissions = {
        all: true,
        notices: true,
        enquiries: true,
        feedback: true,
        grievances: true,
        tours: true,
        gallery: true,
        syllabus: true,
        homepagePopup: true,
        faculty: true,
        chatbotEnquiries: true,
        adminUsers: true,
      };

      setRole("principal");
      setPermissions(superPermissions);
      setAdminRecord({
        email: SUPER_ADMIN_EMAIL,
        role: "principal",
        active: true,
        verified: true,
        displayName: "Ravi Sharma (Principal)",
      });

      // Synchronize/ensure Firestore document exists for Super Admin
      try {
        const { db, firestore } = await getLazyFirestore();
        await firestore.setDoc(
          firestore.doc(db, "adminUsers", currentUser.uid),
          {
            uid: currentUser.uid,
            email: SUPER_ADMIN_EMAIL,
            role: "principal",
            active: true,
            verified: true,
            displayName: "Ravi Sharma (Principal)",
            verifiedBy: "system",
            verifiedAt: firestore.serverTimestamp(),
            permissions: superPermissions,
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Super admin document sync notice:", err);
      }

      setLoading(false);
      return;
    }

    // 2. All other users: must be verified and granted access by Ravi Sharma
    try {
      const { db, firestore } = await getLazyFirestore();
      const userDocRef = firestore.doc(db, "adminUsers", currentUser.uid);
      const userSnapshot = await firestore.getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const record = userSnapshot.data();
        setAdminRecord(record);

        // Account is only active if explicitly verified and activated by Ravi Sharma
        if (record?.verified === true && record?.active === true) {
          setRole(record.role || "staff");
          setPermissions(normalizePermissions(record.permissions));
        } else {
          setRole(null);
          setPermissions({});
        }
      } else {
        // Record does not exist in adminUsers yet
        setAdminRecord({
          status: "pending_verification",
          verified: false,
          active: false,
        });
        setRole(null);
        setPermissions({});
      }
    } catch (error) {
      console.error("Portal authorization check error:", error);
      setRole(null);
      setPermissions({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe;
    setLoading(true);

    const subscribe = async () => {
      const { auth, authSdk } = await getLazyAuth();
      if (!active) return;
      unsubscribe = authSdk.onAuthStateChanged(auth, async (currentUser) => {
        if (!active) return;
        await checkUserAuthorization(currentUser);
      });
    };

    subscribe().catch((error) => {
      console.error("Could not initialize portal authentication:", error);
      if (active) setLoading(false);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [checkUserAuthorization]);

  return {
    user,
    isAuthenticated: Boolean(user),
    role,
    permissions,
    adminRecord,
    loading,
    checkAuth: async () => {
      const { auth } = await getLazyAuth();
      return checkUserAuthorization(auth.currentUser);
    },
    logout: async () => {
      const { auth, authSdk } = await getLazyAuth();
      return authSdk.signOut(auth);
    },
  };
}

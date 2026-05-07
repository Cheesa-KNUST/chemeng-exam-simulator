"use client";

import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "@/lib/firebase";
import { savePushToken } from "@/lib/firestoreService";
import { useAuth } from "@/context/AuthContext";

export function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || typeof window === "undefined") return;

    async function setup() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const messaging = getMessaging(app);

        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
          ),
        });

        if (token) await savePushToken(user.uid, token);

        onMessage(messaging, (payload) => {
          const { title, body } = payload.notification ?? {};
          // Show in-app toast or trigger your existing notification UI
          console.log("Foreground message:", title, body);
        });
      } catch (err) {
        console.error("Push setup failed:", err);
      }
    }

    setup();
  }, [user]);
}

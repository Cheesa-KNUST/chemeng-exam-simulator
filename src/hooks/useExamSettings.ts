"use client";

import { useAuth } from "@/context/AuthContext";
import { listenToUserSettings, UserSettings } from "@/context/userService";
import { useEffect, useState, useMemo } from "react";

export function useExamSettings() {
  const { user } = useAuth();

  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    showAnswers: true,
    shuffleQuestions: true,
    allowReview: true,
    saveChats: true,
  });

  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = listenToUserSettings(user.uid, (s) => {
      setSettings(s);
      setIsSettingsLoaded(true);
    });
    return () => unsub();
  }, [user]);

  const derived = useMemo(() => {
    return {
      showAnswers: settings.showAnswers,
      shuffleQuestions: settings.shuffleQuestions,
      allowReview: settings.allowReview,
      notifications: settings.notifications,
      saveChats: settings.saveChats,
      isSettingsLoaded,
    };
  }, [settings, isSettingsLoaded]);

  return derived;
}

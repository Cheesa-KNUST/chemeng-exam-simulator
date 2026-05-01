"use client";

import { useAuth } from "@/context/AuthContext";
import { listenToUserSettings, UserSettings } from "@/context/userService";
import { useEffect, useState, useMemo } from "react";

export function useExamSettings() {
  const { user } = useAuth();

  const [settings, setSettings] = useState<UserSettings>({
    autoSubmit: true,
    showAnswers: true,
    shuffleQuestions: false,
    allowReview: true,
  });

  useEffect(() => {
    if (!user) return;

    const unsub = listenToUserSettings(user.uid, setSettings);
    return () => unsub();
  }, [user]);

  const derived = useMemo(() => {
    return {
      showAnswers: settings.showAnswers,
      shuffleQuestions: settings.shuffleQuestions,
      allowReview: settings.allowReview,
      autoSubmit: settings.autoSubmit,
    };
  }, [settings]);

  return derived;
}

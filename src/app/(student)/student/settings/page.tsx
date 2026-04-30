"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import {
  listenToUserSettings,
  updateUserSettings,
  getUserProfile,
  UserSettings,
  resetUserExams,
} from "@/context/userService";
import { resetPassword, deleteAccount } from "@/context/authService";

function useToast() {
  const toast = (msg: string, success = true) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium text-white ${
      success ? "bg-emerald-600" : "bg-red-600"
    }`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  };
  return { toast };
}

function Toggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-700 last:border-none">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
          {label}
        </p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
          enabled ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-slate-400 dark:text-slate-500 max-w-[60%] truncate text-right font-mono text-xs">
        {value || "—"}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState<UserSettings>({
    autoSubmit: true,
    showAnswers: true,
    shuffleQuestions: false,
    allowReview: true,
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = listenToUserSettings(user.uid, setSettings);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = getUserProfile(user.uid, (profile) => {
      if (profile?.username) setUsername(profile.username);
    });
    return () => unsub();
  }, [user]);

  const update = async (patch: Partial<UserSettings>) => {
    if (!user) return;
    const newSettings = { ...settings, ...patch };
    setSettings(newSettings);
    try {
      setSaving(true);
      await updateUserSettings(user.uid, newSettings);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast("Password reset email sent", true);
    } catch {
      toast("Failed to send reset email", false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await deleteAccount();
      toast("Account deleted successfully", true);
      router.replace("/");
    } catch (err) {
      console.error(err);
      toast("Failed to delete account. Try logging in again.", false);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleResetProgress = async () => {
    if (!user) return;

    const confirm = window.confirm(
      "This will permanently reset all your exam progress. Continue?",
    );

    if (!confirm) return;

    try {
      setResetting(true);
      await resetUserExams(user.uid);
      toast("Progress reset successfully", true);
    } catch (err) {
      console.error(err);
      toast("Failed to reset progress", false);
    } finally {
      setResetting(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-6 pb-10">
          <PageHeader
            title="Settings"
            subtitle="Manage your exam preferences and account behavior"
          />

          {/* Account card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-base">
                Account
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Basic profile and authentication information
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl px-4 py-3">
              <Row label="Username" value={username} />
              <Row label="Email" value={user?.email ?? ""} />
              <Row label="Unique ID" value={user?.uid ?? ""} />
            </div>

            <div className="flex items-center gap-3">
              <Link href="/student/profile">
                <Button variant="primary">Edit Profile</Button>
              </Link>
              <Button variant="secondary" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-slate-800 dark:text-slate-100 font-semibold text-base">
                  Exam Preferences
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  Control how exams behave for you
                </p>
              </div>
              {saving && (
                <span className="text-xs text-slate-400 dark:text-slate-500 animate-pulse">
                  Saving...
                </span>
              )}
            </div>

            <Toggle
              label="Auto-submit on timer end"
              description="Automatically submit when time runs out"
              enabled={settings.autoSubmit}
              onChange={(v) => update({ autoSubmit: v })}
            />
            <Toggle
              label="Show correct answers immediately"
              description="Reveal answers right after submission"
              enabled={settings.showAnswers}
              onChange={(v) => update({ showAnswers: v })}
            />
            <Toggle
              label="Shuffle questions"
              description="Randomise question order each attempt"
              enabled={settings.shuffleQuestions}
              onChange={(v) => update({ shuffleQuestions: v })}
            />
            <Toggle
              label="Allow review before submission"
              description="Let students go back and change answers"
              enabled={settings.allowReview}
              onChange={(v) => update({ allowReview: v })}
            />
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl p-6">
            <h2 className="text-red-600 dark:text-red-400 font-semibold text-base mb-1">
              Danger Zone
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
              These actions are irreversible. Proceed with caution.
            </p>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleResetProgress}
                disabled={resetting}
              >
                {resetting ? "Resetting..." : "Reset Progress"}
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-xl">
              <h2 className="text-slate-800 dark:text-slate-100 text-lg font-semibold">
                Delete Account?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                This action is irreversible. All your data, results, and
                progress will be permanently removed.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}

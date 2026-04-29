"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import {
  listenToUserSettings,
  updateUserSettings,
  getUserProfile,
  UserSettings,
} from "@/context/userService";

import { resetPassword, deleteAccount } from "@/context/authService";

function useToast() {
  const toast = (msg: string) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className =
      "fixed bottom-5 right-5 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg z-50";
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
    <div className="flex items-center justify-between py-4 border-b border-slate-800 last:border-none">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && (
          <p className="text-slate-400 text-xs mt-0.5">{description}</p>
        )}
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between text-slate-300">
      <span>{label}</span>
      <span className="text-slate-500 max-w-90">{value || "—"}</span>
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsub = listenToUserSettings(user.uid, setSettings);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsub = getUserProfile(user.uid, (profile) => {
      if (profile?.username) {
        setUsername(profile.username);
      }
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
      toast("Password reset email sent");
    } catch {
      toast("Failed to send reset email");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);

      await deleteAccount();

      toast("Account deleted successfully");
      router.replace("/");
    } catch (err) {
      console.error(err);
      toast("Failed to delete account. Try logging in again.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <AppShell>
      <PageContainer>
        <div className="space-y-8">
          <SectionTitle
            title="Settings"
            description="Manage your exam preferences and account behavior"
          />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div>
              <h2 className="text-white font-semibold text-lg">Account</h2>
              <p className="text-slate-400 text-sm">
                Basic profile and authentication information
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <Row label="Username" value={username ?? ""} />
              <Row label="Email" value={user?.email ?? ""} />
              <Row label="Unique ID" value={user?.uid ?? ""} />
            </div>

            <div className="flex items-center gap-5">
              <Link href="/student/profile">
                <Button variant="primary">Edit Profile</Button>
              </Link>

              <Button variant="secondary" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Exam Preferences</h2>

              {saving && (
                <span className="text-xs text-slate-400">Saving...</span>
              )}
            </div>

            <Toggle
              label="Auto-submit on timer end"
              enabled={settings.autoSubmit}
              onChange={(v) => update({ autoSubmit: v })}
            />

            <Toggle
              label="Show correct answers immediately"
              enabled={settings.showAnswers}
              onChange={(v) => update({ showAnswers: v })}
            />

            <Toggle
              label="Shuffle questions"
              enabled={settings.shuffleQuestions}
              onChange={(v) => update({ shuffleQuestions: v })}
            />

            <Toggle
              label="Allow review before submission"
              enabled={settings.allowReview}
              onChange={(v) => update({ allowReview: v })}
            />
          </div>

          <div className="bg-red-950/30 border border-red-900 rounded-2xl p-6">
            <h2 className="text-red-400 font-semibold mb-4">Danger Zone</h2>

            <p className="text-slate-900 text-sm mb-4">
              These actions are irreversible.
            </p>

            <div className="flex gap-3">
              <Button variant="secondary">Reset Progress</Button>

              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-[90%] max-w-md">
              <h2 className="text-white text-lg font-semibold">
                Delete Account?
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                This action is irreversible. All your data will be permanently
                removed.
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
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </AppShell>
  );
}

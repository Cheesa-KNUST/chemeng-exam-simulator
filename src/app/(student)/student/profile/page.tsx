"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PageHeader from "@/components/layout/PageHeader";
import Image from "next/image";

import { upsertUserProfile, getUserProfile } from "@/context/userService";

import { useAuth } from "@/context/AuthContext";

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

type Profile = {
  username: string;
  email: string;
  level: string;
  program: string;
  semester: string;
};

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [original, setOriginal] = useState<Profile>({
    username: "",
    email: "",
    level: "",
    program: "",
    semester: "",
  });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    if (!user) return;

    const unsub = getUserProfile(user.uid, (data) => {
      if (!data) return;

      const profile: Profile = {
        username: data.username || "",
        email: data.email || "",
        level: data.level || "",
        program: data.program || "",
        semester: data.semester || "",
      };

      setOriginal(profile);

      setUsername(profile.username);
      setEmail(profile.email);
      setLevel(profile.level);
      setProgram(profile.program);
      setSemester(profile.semester);
    });

    return () => unsub();
  }, [user]);

  const isDirty = useMemo(() => {
    return (
      username !== original.username ||
      email !== original.email ||
      level !== original.level ||
      program !== original.program ||
      semester !== original.semester
    );
  }, [username, email, level, program, semester, original]);

  const handleCancel = () => {
    setUsername(original.username);
    setLevel(original.level);
    setProgram(original.program);
    setSemester(original.semester);
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      await upsertUserProfile({
        uid: user.uid,
        email: user.email,
        username,
        level,
        program,
        semester,
      });

      toast("Profile updated successfully");
    } catch {
      toast("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = username
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username,
      )}&background=3b82f6&color=fff&size=256`
    : `https://ui-avatars.com/api/?name=User&background=1e293b&color=94a3b8&size=256`;

  return (
    <AppShell>
      <div className="space-y-8 pb-10">
        <PageHeader
          title="Profile Settings"
          subtitle="Manage your account settings and academic profile."
        />

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 mb-8 border-b border-slate-800/80">
            <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 shrink-0">
              <Image
                src={avatarUrl}
                alt="Profile Avatar"
                width={112}
                height={112}
                unoptimized
                className="object-cover w-full h-full"
              />
            </div>

            <div className="pt-2 text-center sm:text-left">
              <h3 className="text-white font-semibold text-lg">
                Profile Picture
              </h3>

              <p className="text-slate-400 text-sm mt-1 max-w-sm">
                Avatar updates automatically from your username.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h2 className="text-white font-semibold text-xl">
                Personal Information
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Update your academic profile and identity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Username</label>

                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kwame Atta Fiifi Forson"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>

                <Input value={email} disabled />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">
                  Academic Program
                </label>

                <Input
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="Chemical Engineering"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Current Level</label>

                <Input
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Semester</label>

                <Input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            {isDirty && (
              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-slate-800/80">
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

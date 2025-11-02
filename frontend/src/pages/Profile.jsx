import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { apiPut, apiGet } from "../api/client";
import Button from "../components/ui/Button";
import CustomSelect from "../components/ui/CustomSelect";
import { User, Mail, Laptop, Lightbulb } from "lucide-react";

export default function Profile() {
  const { user, fetchMe, logout } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    interests: [],
    experience: [],
    roles: [],
  });

  // загрузка профиля
  useEffect(() => {
    if (!user) fetchMe();
  }, [user, fetchMe]);

  // загрузка опций
  useEffect(() => {
    async function fetchOptions() {
      try {
        const data = await apiGet("/api/options");
        setOptions(data);
      } catch (err) {
        console.error("Failed to load options", err);
      }
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        role: user.role || "",
        experience: user.experience || "",
        interests: user.interests || [],
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleInterest(interest) {
    setFormData((prev) => {
      const alreadySelected = prev.interests.includes(interest);
      return {
        ...prev,
        interests: alreadySelected
          ? prev.interests.filter((i) => i !== interest)
          : [...prev.interests, interest],
      };
    });
  }

  async function handleSave() {
    setLoading(true);
    try {
      await apiPut("/api/profile/me", formData);
      await fetchMe();
      setEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <main className="flex flex-col items-center pt-20 text-center">
        <p className="text-[var(--color-muted)]">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center pt-14 text-center">
      <h2 className="text-[26px] font-bold text-primary mb-2">
        Your Ghostly ID
      </h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-10">
        This is your haunted hacker profile - edit it if you dare.🕸️
      </p>

      <div
        className="
          relative mx-auto mt-8
          w-[27rem] min-h-[30rem]
          flex flex-col items-center
          rounded-[var(--radius-xl)]
          bg-[var(--color-surface)]
          border-2 border-[var(--color-primary)]
          shadow-[var(--shadow-card)]
          px-10 py-10 text-left
        "
      >
        {!editMode && (
          <img
            src="/images/ghost.png"
            alt="avatar"
            className="w-[150px] h-[150px] object-contain mb-8 self-center"
          />
        )}

        {!editMode ? (
          <>
            <div className="space-y-4 text-[18px] text-[var(--color-text)] w-full">
              <div className="flex items-center gap-3">
                <User className="text-[var(--color-primary)] w-5 h-5" />
                <span className="font-medium">{user.name}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-[var(--color-primary)] w-5 h-5" />
                <span className="font-medium">{user.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Laptop className="text-[var(--color-primary)] w-5 h-5" />
                <span className="font-medium capitalize">
                  {user.role} · {user.experience}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="text-[var(--color-primary)] w-5 h-5 mt-[2px]" />
                <span className="font-medium">
                  {user.interests?.length
                    ? user.interests.join(", ")
                    : "No interests selected"}
                </span>
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="mt-8 self-center">
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Edit form */}
            <div className="w-full text-left space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-full px-5 py-2 border border-[var(--color-border-soft)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />

              <CustomSelect
                value={formData.role}
                options={options.roles}
                onChange={(val) => setFormData((p) => ({ ...p, role: val }))}
              />

              <CustomSelect
                value={formData.experience}
                options={options.experience}
                onChange={(val) =>
                  setFormData((p) => ({ ...p, experience: val }))
                }
              />

              <div className="mt-4">
                <p className="text-[var(--color-muted)] text-sm mb-2">
                  Select your interests:
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.interests.map((opt) => {
                    const selected = formData.interests.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleInterest(opt)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                          ${
                            selected
                              ? "bg-[var(--color-primary)] text-[var(--color-dark)] border border-[var(--color-primary)]"
                              : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-soft)] hover:border-[var(--color-primary)]"
                          }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex-1"></div>

            <div className="flex justify-center gap-6 mt-6">
              <Button variant="primary" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>

              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>

      <p className="mt-10 text-sm text-[var(--color-muted)]">
        Want to vanish from haunted network?{" "}
        <button
          onClick={logout}
          className="text-[var(--color-primary)] hover:opacity-80 font-semibold"
        >
          Logout 👋
        </button>
      </p>
    </main>
  );
}

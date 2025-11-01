import Button from "./Button";

export default function MatchCard({
  id,
  name,
  role,
  experience,
  matchScore,
  interests,
  invited,
  onInvite,
  onNext,
}) {
  return (
    <div
      className="
        relative mx-auto mt-10
        w-[27rem] h-[36rem]
        flex flex-col items-center justify-start
        rounded-[var(--radius-xl)]
        bg-[var(--color-surface)]
        border-2 border-[var(--color-primary)]
        shadow-[var(--shadow-card)]
        px-10 py-10 text-center
      "
    >
      {/* avatar */}
      <img
        src="/images/ghost.png"
        alt="avatar"
        className="w-[150px] h-[150px] object-contain mb-8"
      />

      {/* name */}
      <h3 className="text-[32px] font-bold text-[var(--color-text)] mb-[4px]">
        {name}
      </h3>

      {/* role + experience */}
      <p className="text-[24px] text-[var(--color-text)] font-medium mb-[4px] capitalize">
        {role} · {experience}
      </p>

      {/* score */}
      <p className="text-[24px] text-[var(--color-text)] mb-[10px]">
        Match Score:{" "}
        <span className="text-[var(--color-primary)] font-semibold">
          {matchScore}%
        </span>
      </p>

      {/* interests */}
      <div className="text-[18px] text-[var(--color-muted)] leading-tight mb-[24px]">
        <p>Interests: {interests?.join(", ")}</p>
      </div>

      <div className="flex-1"></div>

      {/* buttons */}
      <div className="flex justify-center gap-6 mb-4">
        <Button
          variant={invited ? "disabled" : "primary"}
          onClick={!invited ? onInvite : undefined}
          disabled={invited}
        >
          {invited ? "✅ Invited" : "💌 Invite"}
        </Button>

        <Button variant="secondary" onClick={onNext}>
          Next →
        </Button>
      </div>
    </div>
  );
}

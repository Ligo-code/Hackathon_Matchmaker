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
        relative mx-auto mt-8
        w-[340px] sm:w-[360px] md:w-[27rem]
        min-h-[30rem] sm:min-h-[32rem] md:h-[36rem]
        flex flex-col items-center justify-start
        rounded-[var(--radius-xl)]
        bg-[var(--color-surface)]
        border-2 border-[var(--color-primary)]
        shadow-[var(--shadow-card)]
        px-4 sm:px-6 py-6 text-center
        md:px-10 md:py-10
      "
    >
      {/* avatar */}
      <img
        src="/images/ghost.png"
        alt="avatar"
        className="w-[120px] h-[120px] object-contain mb-6 md:w-[150px] md:h-[150px] md:mb-8"
      />

      {/* name */}
      <h3 className="text-[26px] md:text-[32px] font-bold text-[var(--color-text)] mb-[4px]">
        {name}
      </h3>

      {/* role + experience */}
      <p className="text-[20px] md:text-[24px] text-[var(--color-text)] font-medium mb-[4px] capitalize">
        {role} · {experience}
      </p>

      {/* score */}
      <p className="text-[20px] md:text-[24px] text-[var(--color-text)] mb-[10px]">
        Match Score:{" "}
        <span className="text-[var(--color-primary)] font-semibold">
          {matchScore}%
        </span>
      </p>

      {/* interests */}
      <div className="text-[16px] md:text-[18px] text-[var(--color-muted)] leading-tight mb-[20px] md:mb-[24px] px-2 md:px-0 break-words">
        <p>Interests: {interests?.join(", ")}</p>
      </div>

      <div className="flex-1"></div>

      {/* buttons */}
      <div className="flex justify-center gap-4 md:gap-6 mb-4">
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

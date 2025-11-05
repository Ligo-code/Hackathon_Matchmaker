import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import MatchCard from "../components/ui/MatchCard";
import Button from "../components/ui/Button";
import {
  getNextCandidate,
  sendInvite,
  skipCandidate,
  resetMatches,
} from "../api/matches";

export default function Dashboard() {
  const [candidate, setCandidate] = useState(null);
  const [finished, setFinished] = useState(false);
  const [invited, setInvited] = useState([]);

  async function loadCandidate() {
    const data = await getNextCandidate();
    if (!data.hasMore) setFinished(true);
    else setCandidate(data.candidate);
  }

  async function handleInvite() {
    await sendInvite(candidate._id);
    setInvited((prev) => [...prev, candidate._id]);
  }

  async function handleNext() {
    await skipCandidate(candidate._id);
    await loadCandidate();
  }

  async function handleRestart() {
    await resetMatches();
    setFinished(false);
    await loadCandidate();
  }

  useEffect(() => {
    loadCandidate();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleNext,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // === FINISHED STATE ===
  if (finished) {
    return (
      <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
        <h2 className="text-[26px] font-bold text-primary mb-2 text-center max-w-[22rem] sm:max-w-none">
          Your Best Match Awaits... ✨
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-8 text-center max-w-[22rem] sm:max-w-none">
          Find your perfect teammate this hackathon — fast & fun!
        </p>

        <div
          className="
            flex flex-col items-center justify-center
            w-[340px] sm:w-[360px] md:w-[27rem]
            min-h-[30rem] sm:min-h-[32rem] md:h-[36rem]
            mt-10
            border-2 border-[var(--color-primary)]
            rounded-[var(--radius-xl)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-card)]
            text-center
            px-4 sm:px-6 py-6 md:px-10 md:py-10
          "
        >
          <p className="text-[60px] mb-4">💀</p>
          <p className="text-[22px] font-medium text-[var(--color-text)] mb-6 leading-tight">
            No more spooky <br /> matches for now!
          </p>
          <Button variant="primary" onClick={handleRestart}>
            Start Over
          </Button>
        </div>
      </main>
    );
  }

  // === LOADING STATE ===
  if (!candidate)
    return (
      <p className="text-center text-[var(--color-muted)] mt-20">
        Loading next match...
      </p>
    );

  // === DEFAULT STATE ===
  return (
    <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
      <h2 className="text-[26px] font-bold text-primary mb-2 text-center max-w-[22rem] sm:max-w-none">
        Your Best Match Awaits... ✨
      </h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-10 text-center max-w-[22rem] sm:max-w-none">
        Find your perfect teammate this hackathon — fast & fun!
      </p>

      <div {...swipeHandlers} className="touch-pan-y">
        <MatchCard
          key={candidate._id}
          id={candidate._id}
          name={candidate.name}
          role={candidate.role}
          experience={candidate.experience}
          matchScore={candidate.matchScore}
          interests={candidate.interests}
          onInvite={handleInvite}
          onNext={handleNext}
          invited={invited.includes(candidate._id)}
          showPrev={false}
          showNext={true}
        />
      </div>
    </main>
  );
}

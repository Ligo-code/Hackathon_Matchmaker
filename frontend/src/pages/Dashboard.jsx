import { useEffect, useState } from "react";
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

  if (finished) {
    return (
      <main className="flex flex-col items-center pt-20">
        <h2 className="text-[26px] font-bold text-primary mb-2">
          Your Best Match Awaits... ✨
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-8">
          Find your perfect teammate this hackathon — fast & fun!
        </p>

        <div className="flex flex-col items-center justify-center w-[27rem] h-[36rem] mt-12 border-2 border-[var(--color-primary)] rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] text-center">
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

  if (!candidate)
    return (
      <p className="text-center text-[var(--color-muted)] mt-20">
        Loading next match...
      </p>
    );

  return (
    <main className="flex flex-col items-center pt-20">
      <h2 className="text-[26px] font-bold text-primary mb-2">
        Your Best Match Awaits... ✨
      </h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-10">
        Find your perfect teammate this hackathon — fast & fun!
      </p>

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
    </main>
  );
}

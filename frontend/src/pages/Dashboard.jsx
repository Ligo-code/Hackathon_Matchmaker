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
import { useAuthStore } from "../store/useAuthStore";

export default function Dashboard() {
  const { user, fetchMe } = useAuthStore(); // 🔹 use Zustand
  const [candidate, setCandidate] = useState(null);
  const [finished, setFinished] = useState(false);
  const [invited, setInvited] = useState([]);

  useEffect(() => {
    // 🔹 ensure user is loaded first (important for Safari)
    if (!user) {
      fetchMe();
      return;
    }

    const loadCandidate = async () => {
      try {
        const data = await getNextCandidate();
        if (!data?.hasMore) setFinished(true);
        else setCandidate(data.candidate);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      }
    };

    loadCandidate();
  }, [user, fetchMe]);

  async function handleInvite() {
    await sendInvite(candidate._id);
    setInvited((prev) => [...prev, candidate._id]);
  }

  async function handleNext() {
    await skipCandidate(candidate._id);
    const data = await getNextCandidate();
    if (!data?.hasMore) setFinished(true);
    else setCandidate(data.candidate);
  }

  async function handleRestart() {
    await resetMatches();
    setFinished(false);
    const data = await getNextCandidate();
    setCandidate(data.candidate);
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handleNext,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!user)
    return (
      <main className="flex justify-center items-center h-screen">
        <p className="text-[var(--color-muted)]">Loading user...</p>
      </main>
    );

  if (finished)
    return (
      <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
        <h2 className="text-[26px] font-bold text-primary mb-2 text-center">
          Your Best Match Awaits... ✨
        </h2>
        <Button variant="primary" onClick={handleRestart}>
          Start Over
        </Button>
      </main>
    );

  if (!candidate)
    return (
      <p className="text-center text-[var(--color-muted)] mt-20">
        Loading next match...
      </p>
    );

  return (
    <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
      <h2 className="text-[26px] font-bold text-primary mb-2 text-center">
        Your Best Match Awaits... ✨
      </h2>
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
        />
      </div>
    </main>
  );
}

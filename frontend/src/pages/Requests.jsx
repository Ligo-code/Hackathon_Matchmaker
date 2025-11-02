import { useEffect, useState } from "react";
import RequestCard from "../components/ui/RequestCard";
import Button from "../components/ui/Button";
import {
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
} from "../api/requests";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showMatch, setShowMatch] = useState(false); 

  async function loadRequests() {
    try {
      const data = await getIncomingRequests();
      if (data.invites?.length > 0) {
        setRequests(data.invites);
        setFinished(false);
      } else {
        setFinished(true);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      setFinished(true);
    }
  }

  async function handleAccept(id) {
    await acceptRequest(id);
    setShowMatch(true); 
  }

  async function handleReject(id) {
    await rejectRequest(id);
    nextRequest(); 
  }

  function nextRequest() {
    setShowMatch(false);
    if (currentIndex + 1 < requests.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  function prevRequest() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  // no requests
  if (finished) {
    return (
      <main className="flex flex-col items-center pt-20">
        <h2 className="text-[26px] font-bold text-primary mb-2">
          Match Requests... 👻
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-8">
          Other ghosts want to team up with you!
        </p>

        <div className="flex flex-col items-center justify-center w-[27rem] h-[36rem] mt-12 border-2 border-[var(--color-primary)] rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] text-center">
          <p className="text-[60px] mb-4">💀</p>
          <p className="text-[22px] font-medium text-[var(--color-text)] mb-6 leading-tight">
            No match requests yet!
          </p>
        </div>
      </main>
    );
  }

  const current = requests[currentIndex];
  

  // “It’s a Match!”
  if (showMatch) {
    return (
        <main className="flex flex-col items-center pt-20">
            <h2 className="text-[26px] font-bold text-primary mb-2">
                Match Requests... 👻
            </h2>
            <p className="text-[16px] text-[var(--color-muted)] mb-10">
                Other ghosts want to team up with you!
            </p>

            <div className="flex flex-col items-center justify-center w-[27rem] h-[36rem] border-2 border-[var(--color-primary)] rounded-[var(--radius-xl)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] text-center p-10">
                <p className="text-[48px] mb-4">🎉</p>
                <p className="text-[24px] font-semibold text-[var(--color-text)] mb-2">
                It’s a Match!
                </p>

                <p className="text-[18px] text-[var(--color-muted)] mb-10 leading-relaxed">
                You’ve matched with{" "}
                <span className="text-[var(--color-primary)] font-bold">
                    {current.from.name}
                </span>
                !<br />
                You are now connected!<br />
                Check your Messages 👻
                </p>

                <Button variant="primary" onClick={nextRequest}>
                Next →
                </Button>
            </div>
            </main>

      );
      
  }

  
  return (
    <main className="flex flex-col items-center pt-20">
      <h2 className="text-[26px] font-bold text-primary mb-2">
        Match Requests... 👻
      </h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-10">
        Other ghosts want to team up with you!
      </p>

      <RequestCard
        key={current?._id}
        id={current?._id}
        name={current?.from?.name}
        role={current?.from?.role}
        experience={current?.from?.experience}
        matchScore={current?.matchScore}
        interests={current?.from?.interests}
        onAccept={() => handleAccept(current?._id)}
        onReject={() => handleReject(current?._id)}
        showPrev={currentIndex > 0}
        showNext={currentIndex < requests.length - 1}
        onPrev={prevRequest}
        onNext={nextRequest}
/>
    </main>
  );
}

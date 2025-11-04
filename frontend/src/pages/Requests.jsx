import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextRequest,
    onSwipedRight: nextRequest,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // === EMPTY STATE ===
  if (finished) {
    return (
      <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
        <h2 className="text-[26px] font-bold text-primary mb-2 text-center max-w-[22rem] sm:max-w-none">
          Match Requests... 👻
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-8 text-center max-w-[22rem] sm:max-w-none">
          Other ghosts want to team up with you!
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
            No match requests yet!
          </p>
        </div>
      </main>
    );
  }

  const current = requests[currentIndex];

  // === MATCH CONFIRMATION STATE ===
  if (showMatch) {
    return (
      <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
        <h2 className="text-[26px] font-bold text-primary mb-2 text-center max-w-[22rem] sm:max-w-none">
          Match Requests... 👻
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-10 text-center max-w-[22rem] sm:max-w-none">
          Other ghosts want to team up with you!
        </p>

        <div
          className="
            flex flex-col items-center justify-center
            w-[340px] sm:w-[360px] md:w-[27rem]
            min-h-[30rem] sm:min-h-[32rem] md:h-[36rem]
            border-2 border-[var(--color-primary)]
            rounded-[var(--radius-xl)]
            bg-[var(--color-surface)]
            shadow-[var(--shadow-card)]
            text-center
            px-4 sm:px-6 py-6 md:px-10 md:py-10
          "
        >
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

  // === DEFAULT STATE ===
  return (
    <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
      <h2 className="text-[26px] font-bold text-primary mb-2 text-center max-w-[22rem] sm:max-w-none">
        Match Requests... 👻
      </h2>
      <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-10 text-center max-w-[22rem] sm:max-w-none">
        Other ghosts want to team up with you!
      </p>

      <div {...swipeHandlers} className="touch-pan-y">
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
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import RequestCard from "../components/ui/RequestCard";
import Button from "../components/ui/Button";
import {
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
} from "../api/requests";
import { useAuthStore } from "../store/useAuthStore";

export default function Requests() {
  const { user, fetchMe } = useAuthStore(); // 🔹 use Zustand
  const [requests, setRequests] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchMe();
      return;
    }

    const loadRequests = async () => {
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
    };

    loadRequests();
  }, [user, fetchMe]);

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextRequest,
    onSwipedRight: nextRequest,
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
          Match Requests... 👻
        </h2>
        <p className="text-[16px] text-[var(--color-muted)] mb-6 md:mb-8">
          No match requests yet!
        </p>
      </main>
    );

  const current = requests[currentIndex];

  if (showMatch)
    return (
      <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
        <p className="text-[22px] text-[var(--color-muted)] mb-4">
          You matched with{" "}
          <span className="text-[var(--color-primary)] font-bold">
            {current?.from?.name}
          </span>{" "}
          🎉
        </p>
        <Button variant="primary" onClick={nextRequest}>
          Next →
        </Button>
      </main>
    );

  return (
    <main className="flex flex-col items-center pt-10 md:pt-20 px-4">
      <h2 className="text-[26px] font-bold text-primary mb-2 text-center">
        Match Requests... 👻
      </h2>
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
        />
      </div>
    </main>
  );
}

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      console.log("✅ beforeinstallprompt fired");
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Install prompt outcome:", outcome);
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3">
      <button onClick={handleInstallClick} className="btn btn-primary shadow-lg">
        📲 Install LevelGrit App
      </button>
    </div>
  );
}

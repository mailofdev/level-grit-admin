import React, { useState, useRef } from 'react';
import { Share2, X, Download, Instagram, MessageCircle, Image } from 'lucide-react';
import html2canvas from 'html2canvas'; // ✅ add this package for dom-to-image

export default function ShareProgressDemo() {
  const [showShareModal, setShowShareModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('square');
  const shareCardRef = useRef(null);

  const progressData = {
    userName: "Alex Johnson",
    streak: 12,
    streakGoal: 20,
    macros: {
      calories: { current: 2125, target: 2500 },
      protein: { current: 184, target: 200 },
      carbs: { current: 238, target: 300 },
      fat: { current: 152, target: 80 }
    },
    mealsCompleted: 5,
    totalMeals: 6,
    date: new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  };

  // ✅ Convert the preview card into an image Blob
const generateProgressImage = async () => {
  if (!shareCardRef.current) return null;
  setIsGenerating(true);

  try {
    const target = shareCardRef.current;

    // Force HD resolution for Instagram (Story: 1080x1920)
    const width = 1080;
    const height = 1920;

    const canvas = await html2canvas(target, {
      backgroundColor: "#835AF1", // solid fallback for gradients
      useCORS: true,
      allowTaint: true,
      scale: 3, // internal render quality
      width,
      height,
      windowWidth: target.scrollWidth,
      windowHeight: target.scrollHeight,
    });

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const ctx = resizedCanvas.getContext("2d");
    ctx.drawImage(canvas, 0, 0, width, height);

    const blob = await new Promise((resolve) => resizedCanvas.toBlob(resolve, "image/png", 1.0));
    setIsGenerating(false);
    return blob;
  } catch (error) {
    // Error generating image
    setIsGenerating(false);
    return null;
  }
};


  // ✅ Universal download helper
  const downloadImage = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ✅ Handles all share actions
  const handleShare = async (platform) => {
    const imageBlob = await generateProgressImage();
    if (!imageBlob) return;

    const fileName = aspectRatio === 'story' ? 'fitness-story.png' : 'fitness-post.png';
    const shareText = `💪 I'm on a ${progressData.streak}-day fitness streak!\n🔥 ${progressData.mealsCompleted}/${progressData.totalMeals} meals completed today!\n✨ Keep pushing! #FitnessJourney #HealthyLiving`;

    if (platform === 'native' && navigator.share) {
      const file = new File([imageBlob], fileName, { type: 'image/png' });
      try {
        await navigator.share({
          title: 'My Fitness Progress',
          text: shareText,
          files: [file],
        });
      } catch {
        // Share cancelled
      }
    } 
    
    else if (platform === 'whatsapp') {
      // ✅ WhatsApp supports text sharing, not images directly from web
      downloadImage(imageBlob, fileName);
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      }, 500);
    } 
    
    else if (platform === 'instagram') {
      // ✅ Instagram cannot accept browser-uploaded media — we guide the user
      downloadImage(imageBlob, fileName);
      alert(`✅ Image downloaded!\n\n📱 To share on Instagram:\n1. Open Instagram App\n2. Tap ➕ to create a ${aspectRatio === 'story' ? 'Story' : 'Post'}\n3. Choose the downloaded image\n4. Add your caption and share!`);
      window.open('https://www.instagram.com/', '_blank');
    } 
    
    else if (platform === 'download') {
      downloadImage(imageBlob, fileName);
    }

    setShowShareModal(false);
  };

  // ✅ Mini circular progress display
  const CircularProgress = ({ value, max, size = 70 }) => {
    const percentage = Math.round((value / max) * 100);
    const radius = (size - 10) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative inline-block" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="6"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold" style={{ fontSize: size / 4 }}>{percentage}%</span>
        </div>
      </div>
    );
  };

  const ProgressCard = ({ isStory }) => {
    const cardStyle = isStory ? {
  width: "1080px",
  height: "1920px",
  padding: "60px 80px",
  borderRadius: "0px",
  background: "linear-gradient(180deg, #6a11cb 0%, #2575fc 100%)",
} : {
  width: "400px",
  padding: "32px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
};

    return (
      <div 
        ref={shareCardRef}
        style={{
          ...cardStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          borderRadius: '20px',
          color: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💪</div>
          <h2 style={{ fontSize: isStory ? '32px' : '28px', fontWeight: 'bold', marginBottom: '4px' }}>
            {progressData.userName}
          </h2>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            {progressData.date}
          </p>
        </div>

        {/* Streak Banner */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '48px' }}>🔥</span>
            <div>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                {progressData.streak} Days
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Fitness Streak</div>
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'white',
              height: '100%',
              width: `${(progressData.streak / progressData.streakGoal) * 100}%`,
              borderRadius: '8px'
            }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
            Goal: {progressData.streakGoal} days
          </div>
        </div>

        {/* Macros Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {Object.entries(progressData.macros).map(([key, value]) => (
            <div key={key} style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <CircularProgress value={value.current} max={value.target} size={isStory ? 80 : 70} />
              </div>
              <div style={{ textTransform: 'capitalize', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                {key}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>
                {value.current}/{value.target}
              </div>
            </div>
          ))}
        </div>

        {/* Meals Completed */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
            {progressData.mealsCompleted}/{progressData.totalMeals}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            Meals Completed Today
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', opacity: 0.7 }}>
          #FitnessJourney #HealthyLiving #ConsistencyIsKey
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{progressData.streak}-Day Streak!</h2>
          <p className="text-gray-600 mb-4">Share your progress with friends!</p>

          <button
            onClick={() => setShowShareModal(true)}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 hover:shadow-xl transition-all"
          >
            <Share2 size={20} />
            Share Progress
          </button>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Image size={22} />
                  Share Progress
                </h3>
                <button onClick={() => setShowShareModal(false)} className="hover:bg-white/20 rounded-full p-2">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="text-center mb-3">Preview</div>
                <div className="flex justify-center">
                  <div className="scale-90">
                    <ProgressCard isStory={aspectRatio === 'story'} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl hover:bg-green-600 transition"
                  >
                    <MessageCircle size={20} /> WhatsApp
                  </button>

                  <button
                    onClick={() => handleShare('instagram')}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:opacity-90 transition"
                  >
                    <Instagram size={20} /> Instagram
                  </button>
                </div>

                <button
                  onClick={() => handleShare('download')}
                  className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

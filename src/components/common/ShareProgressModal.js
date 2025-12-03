import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FaShareAlt, FaWhatsapp, FaInstagram, FaDownload, FaFire } from 'react-icons/fa';
import { Toast } from 'primereact/toast';

const ShareProgressModal = ({ show, onHide, clientData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('gradient');
  const shareCardRef = useRef(null);
  const toast = useRef(null);

  const themes = {
    gradient: {
      name: 'Aurora',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 50%, #00C099 100%)',
      icon: '🌈'
    },
    sunset: {
      name: 'Sunset',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
      icon: '🌅'
    },
    ocean: {
      name: 'Ocean',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #006650 50%, #008066 100%)',
      icon: '🌊'
    },
    forest: {
      name: 'Forest',
      background: 'linear-gradient(135deg, #006650 0%, var(--color-primary) 100%)',
      icon: '🌲'
    },
    fire: {
      name: 'Fire',
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #00C099 100%)',
      icon: '🔥'
    }
  };

  // Note: html2canvas needs to be imported in the parent component
  const generateProgressImage = async () => {
    if (!shareCardRef.current || !window.html2canvas) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Image generation library not loaded.',
        life: 3000
      });
      return null;
    }
    
    setIsGenerating(true);
    
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await window.html2canvas(shareCardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        imageTimeout: 0,
      });
      
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
      setIsGenerating(false);
      return blob;
    } catch (error) {
      setIsGenerating(false);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to generate image. Please try again.',
        life: 3000
      });
      return null;
    }
  };

  const handleSharePlatform = async (platform) => {
    const imageBlob = await generateProgressImage();
    if (!imageBlob) return;

    const file = new File([imageBlob], 'fitness-progress.png', { type: 'image/png' });
    const shareText = `💪 I'm on a ${clientData.streak}-day fitness streak!\n🔥 ${clientData.completedMeals}/${clientData.totalMeals} meals completed today!\n✨ Keep pushing! #FitnessJourney #HealthyLiving`;

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'My Fitness Progress',
          text: shareText,
          files: [file]
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else if (platform === 'whatsapp') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isMobile) {
          const whatsappDeepLink = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
          window.location.href = whatsappDeepLink;
          
          setTimeout(() => {
            const whatsappWebUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
            window.open(whatsappWebUrl, '_blank');
          }, 2000);
        } else {
          const whatsappWebUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
          window.open(whatsappWebUrl, '_blank');
        }
        
        toast.current?.show({
          severity: 'success',
          summary: '📸 Image Downloaded!',
          detail: 'Upload the image to your WhatsApp Status from your gallery.',
          life: 5000
        });
      }, 500);
    } else if (platform === 'instagram') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress-story.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      setTimeout(() => {
        if (isAndroid) {
          window.location.href = 'instagram://story-camera';
          setTimeout(() => window.location.href = 'instagram://', 1500);
          setTimeout(() => window.open('https://play.google.com/store/apps/details?id=com.instagram.android', '_blank'), 3000);
        } else if (isIOS) {
          window.location.href = 'instagram://story-camera';
          setTimeout(() => window.location.href = 'instagram://', 1500);
          setTimeout(() => window.open('https://apps.apple.com/app/instagram/id389801252', '_blank'), 3000);
        } else {
          window.open('https://www.instagram.com/', '_blank');
        }
        
        toast.current?.show({
          severity: 'success',
          summary: '📸 Image Downloaded!',
          detail: isMobile 
            ? 'Opening Instagram... Create a Story and select the image from your gallery.' 
            : 'Open Instagram app on your phone, create a Story, and select the downloaded image.',
          life: 6000
        });
      }, 500);
    } else if (platform === 'download') {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'fitness-progress.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.current?.show({
        severity: 'success',
        summary: '✅ Downloaded!',
        detail: 'Image saved to your downloads folder.',
        life: 3000
      });
    }
    
    onHide();
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={show}
        onHide={onHide}
        header={
          <div className="d-flex align-items-center gap-2">
            <div className="bg-gradient rounded-3 p-2" style={{background: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)'}}>
              <span style={{fontSize: '24px'}}>📊</span>
            </div>
            <div>
              <div className="fs-5 fw-bold">Share Your Progress</div>
              <small className="text-muted fw-normal">Choose a theme and share your achievement</small>
            </div>
          </div>
        }
        style={{ width: '95vw', maxWidth: '1200px' }}
        modal
        dismissableMask
      >
        <div className="row g-3 g-md-4 mt-2">
          <div className="col-12 col-lg-6">
            <div className="bg-light rounded-4 p-3 p-md-4" style={{border: '2px dashed var(--color-border)'}}>
              <div className="mb-3">
                <label className="fw-semibold mb-2 d-block small">🎨 Choose Theme</label>
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`btn btn-sm ${selectedTheme === key ? 'btn-primary' : 'btn-outline-secondary'}`}
                      style={{
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      <span className="me-1">{theme.icon}</span>
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <div 
                  ref={shareCardRef}
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    aspectRatio: '9/16',
                    background: themes[selectedTheme].background,
                    borderRadius: '20px',
                    padding: '28px 20px',
                    color: 'white',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '42px', marginBottom: '10px' }}>💪</div>
                      <h3 style={{ margin: 0, fontSize: '26px', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                        {clientData.name}
                      </h3>
                      <p style={{ margin: '6px 0 0 0', fontSize: '13px', opacity: 0.9 }}>
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>

                    <div 
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '18px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '14px' }}>
                        <FaFire style={{fontSize: '40px'}} />
                        <div>
                          <div style={{ fontSize: '32px', fontWeight: '900', lineHeight: 1 }}>
                            {clientData.streak}
                          </div>
                          <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '600' }}>Day Streak</div>
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        height: '7px',
                        overflow: 'hidden',
                        marginBottom: '8px',
                      }}>
                        <div 
                          style={{
                            background: 'white',
                            height: '100%',
                            width: `${(clientData.streakCurrent / clientData.streakGoal) * 100}%`,
                            borderRadius: '8px',
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                          }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', fontSize: '12px', opacity: 0.9, fontWeight: '600' }}>
                        🎯 Goal: {clientData.streakGoal} days
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                      {clientData.macros.slice(0, 2).map((macro) => {
                        const percentage = Math.round((macro.value / macro.target) * 100);
                        return (
                          <div 
                            key={macro.label}
                            style={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '14px',
                              padding: '14px',
                              textAlign: 'center',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <div className="mb-2">
                              <div 
                                className="position-relative d-inline-block"
                                style={{ width: '46px', height: '46px' }}
                              >
                                <svg width="46" height="46" style={{ transform: 'rotate(-90deg)' }}>
                                  <circle
                                    cx="23"
                                    cy="23"
                                    r="18"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="4"
                                  />
                                  <circle
                                    cx="23"
                                    cy="23"
                                    r="18"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="4"
                                    strokeDasharray={`${(percentage / 100) * (2 * Math.PI * 18)} ${2 * Math.PI * 18}`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div 
                                  className="position-absolute top-50 start-50 translate-middle"
                                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                                >
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                            <div className="text-capitalize fw-semibold" style={{ fontSize: '12px', marginBottom: '2px' }}>
                              {macro.label}
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.8 }}>
                              {macro.value}/{macro.target}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div 
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <div style={{ fontSize: '14px', marginBottom: '6px' }}>🍽️</div>
                      <div style={{ fontSize: '26px', fontWeight: '900', marginBottom: '2px' }}>
                        {clientData.completedMeals}/{clientData.totalMeals}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.9, fontWeight: '600' }}>
                        Meals Completed Today
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', opacity: 0.7, fontWeight: '600' }}>
                      #FitnessJourney #HealthyLiving
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-3 h-100">
              <div className="bg-light rounded-3 p-3 mb-2">
                <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                  <span>📱</span>
                  Share Options
                </h6>
                <p className="mb-0 small text-muted">
                  Choose how you want to share your progress
                </p>
              </div>

              {navigator.share && (
                <Button
                  label={isGenerating ? "Generating..." : "Share via..."}
                  icon={<FaShareAlt />}
                  onClick={() => handleSharePlatform("native")}
                  disabled={isGenerating}
                  className="w-100"
                  style={{
                    minHeight: "56px",
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #008066 100%)',
                    border: 'none',
                    color: 'var(--color-button-text)',
                  }}
                />
              )}

              <Button
                label="Share on WhatsApp"
                icon={<FaWhatsapp />}
                onClick={() => handleSharePlatform("whatsapp")}
                disabled={isGenerating}
                className="w-100"
                style={{
                  minHeight: "56px",
                  background: '#25D366',
                  border: 'none',
                  color: 'white',
                }}
              />

              <Button
                label="Share on Instagram Story"
                icon={<FaInstagram />}
                onClick={() => handleSharePlatform("instagram")}
                disabled={isGenerating}
                className="w-100"
                style={{
                  minHeight: "56px",
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  border: 'none',
                  color: 'white',
                }}
              />

              <Button
                label="Download Image"
                icon={<FaDownload />}
                onClick={() => handleSharePlatform("download")}
                disabled={isGenerating}
                className="w-100"
                style={{
                  minHeight: "56px",
                  background: 'var(--color-text-dark)',
                  border: 'none',
                  color: 'var(--color-button-text)',
                }}
              />

              <div className="alert alert-info mb-0 d-flex align-items-start gap-2" style={{fontSize: '13px', lineHeight: '1.5'}}>
                <span style={{fontSize: '18px'}}>💡</span>
                <div>
                  <strong>Tip:</strong> For Instagram, the image will be downloaded. Open Instagram, create a Story, and select the image from your gallery to share!
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ShareProgressModal;
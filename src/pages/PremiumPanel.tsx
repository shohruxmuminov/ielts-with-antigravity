import { useState, useEffect } from 'react';
import { Crown, Send, Phone, CheckCircle, Lock, Star, Zap, Shield } from 'lucide-react';
import { usePremium } from '../context/PremiumContext';
import { useAuth } from '../FirebaseProvider';

export default function PremiumPanel() {
  const { isPremium, premiumUntil, activatePremium, deactivatePremium } = usePremium();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'payment'>('code');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    if (activeTab === 'payment' && !isPremium) {
      // Initialize Global Payments UI
      const script = document.createElement('script');
      script.src = "https://js.globalpay.com/v1/globalpayments.js";
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        const GlobalPayments = window.GlobalPayments;
        if (!GlobalPayments) return;

        GlobalPayments.configure({
          publicApiKey: "pkapi_cert_dNpEYIISXCGDDyKJiV" // Sandbox Test Key
        });

        const cardForm = GlobalPayments.ui.form({
          fields: {
            "card-number": {
              placeholder: "•••• •••• •••• ••••",
              target: "#credit-card-card-number"
            },
            "card-expiration": {
              placeholder: "MM / YYYY",
              target: "#credit-card-card-expiration"
            },
            "card-cvv": {
              placeholder: "•••",
              target: "#credit-card-card-cvv"
            }
          },
          styles: {
            'input': {
              'color': '#ffffff',
              'font-size': '16px',
              'font-family': 'inherit',
              'font-weight': '700'
            },
            '.invalid': {
              'color': '#f87171'
            }
          }
        });

        cardForm.on("token-success", async (resp: any) => {
          setPaymentLoading(true);
          try {
            const response = await fetch('/api/payment/process-card', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user?.uid,
                paymentToken: resp.paymentReference, // Official Token
                amount: "129.99",
                currency: "EUR"
              })
            });
            const result = await response.json();
            if (response.ok && result.responseCode === '00') {
              setPaymentSuccess(true);
            } else {
              setError(result.message || 'To\'lovda xatolik yuz berdi.');
            }
          } catch (err) {
            setError('Server bilan bog\'lanishda xatolik.');
          } finally {
            setPaymentLoading(false);
          }
        });

        cardForm.on("token-error", (resp: any) => {
          setError(resp.error?.message || 'Karta ma\'lumotlari noto\'g\'ri.');
          setPaymentLoading(false);
        });
      };
      
      // If already loaded
      // @ts-ignore
      if (window.GlobalPayments) {
        script.onload(new Event('load') as any);
      } else {
        document.head.appendChild(script);
      }
    }
  }, [activeTab, isPremium, user]);

  const handleActivate = async () => {
    setError('');
    if (!code.trim()) {
      setError('Kodni kiriting!');
      return;
    }
    
    setLoading(true);
    const ok = await activatePremium(code);
    setLoading(false);
    
    if (ok) {
      setSuccess(true);
      setCode('');
    } else {
      setError('❌ Noto\'g\'ri kod! Telegram orqali to\'g\'ri kodni oling.');
    }
  };

  const handleManualPaymentNotify = () => {
    // This is now handled by the Global Payments SDK submit listener or trigger
    // @ts-ignore
    const submitBtn = document.querySelector('.gp-submit-trigger');
    if (submitBtn) (submitBtn as any).click();
  };

  const formatExpiry = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('uz-UZ', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 py-16 px-6 text-center">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffd700 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ff6b35 0%, transparent 50%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
              <Crown className="w-12 h-12 text-yellow-200" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">
            Premium Membership
          </h1>
          <p className="text-orange-100 text-xl font-medium opacity-90 max-w-xl mx-auto">
            Barcha premium testlar va materiallarga to'liq kirish imkoni
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Benefits */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white mb-8">Premium imtiyozlari</h2>
            {[
              { icon: Star, title: 'Eksklyuziv testlar', desc: 'Reading, Listening, Writing, Speaking va Mock Exam bo\'limi uchun maxsus premium testlar' },
              { icon: Zap, title: 'Tez yangilanish', desc: 'Har haftada yangi premium test materiallari qo\'shiladi' },
              { icon: Shield, title: 'IELTS Band 7+', desc: 'Band score 7 va undan yuqori nishonga yo\'naltirilgan testlar' },
              { icon: CheckCircle, title: 'Barcha bo\'limlar', desc: '5 ta bo\'limning barchasida premium testlarga kirish' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5 p-5 bg-slate-900 rounded-3xl border border-slate-800 hover:border-amber-500/30 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                  <item.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Activation Panel */}
          <div>
            {isPremium ? (
              /* Already Premium */
              <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/20 rounded-[2rem] border-2 border-amber-500/40 p-8 text-center shadow-2xl">
                <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-900/50">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white mb-3">Premium Faol! ✨</h3>
                <div className="bg-amber-950/40 rounded-2xl p-4 mb-8 border border-amber-500/20">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">Amal qilish muddati:</p>
                  <p className="text-amber-200 font-bold">{formatExpiry(premiumUntil)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {['Reading', 'Listening', 'Writing', 'Speaking', 'Mock Exam', 'Vocabulary'].map(s => (
                    <div key={s} className="flex items-center gap-2 bg-amber-900/30 rounded-xl px-3 py-2 text-sm font-bold text-amber-300 border border-amber-500/20">
                      <CheckCircle className="w-4 h-4" /> {s}
                    </div>
                  ))}
                </div>
                <button
                  onClick={deactivatePremium}
                  className="text-slate-500 text-xs hover:text-red-400 transition-colors underline"
                >
                  Premium bekor qilish
                </button>
              </div>
            ) : (
              /* Activation Form */
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-8 shadow-xl">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-800 rounded-2xl border border-slate-700 mb-8">
                  <button 
                    onClick={() => setActiveTab('code')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'code' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Lock className="w-4 h-4" />
                    Kod orqali
                  </button>
                  <button 
                    onClick={() => setActiveTab('payment')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'payment' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Zap className="w-4 h-4" />
                    Karta orqali
                  </button>
                </div>

                {activeTab === 'code' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                      <h3 className="text-xl font-black text-white">Premium Kodni Kiriting</h3>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 space-y-4">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                        Premium kod olish uchun bog'laning:
                      </p>
                      <a
                        href="https://t.me/jujutsukaisen_jap"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-sky-400 hover:text-sky-300 font-bold transition-colors group"
                      >
                        <div className="w-9 h-9 bg-sky-500/10 rounded-xl flex items-center justify-center border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors">
                          <Send className="w-4 h-4" />
                        </div>
                        <span>@jujutsukaisen_jap</span>
                      </a>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                        Aktivatsiya kodi
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setError(''); setSuccess(false); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
                        placeholder="Kodni kiriting..."
                        className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white font-bold text-lg placeholder-slate-600 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-inner"
                      />

                      {error && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-bold text-sm animate-shake">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 font-bold text-sm flex items-center gap-2 animate-bounce-in">
                          <CheckCircle className="w-5 h-5" />
                          Premium muvaffaqiyatli aktivlashtirildi! 🎉
                        </div>
                      )}

                      <button
                        onClick={handleActivate}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-black text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-xl shadow-amber-900/30 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Crown className="w-5 h-5" />
                            Premiumni Aktivlashtirish
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
                          <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-black text-white">Karta ma'lumotlarini kiriting</h3>
                      </div>

                      <div className="bg-slate-800 rounded-3xl p-6 border border-slate-700 space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Karta raqami</label>
                            <div id="credit-card-card-number" className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white font-bold h-[60px]"></div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Amal qilish muddati</label>
                              <div id="credit-card-card-expiration" className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white font-bold h-[60px]"></div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">CVV / CVN</label>
                              <div id="credit-card-card-cvv" className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-5 py-4 text-white font-bold h-[60px]"></div>
                            </div>
                          </div>
                          
                          {/* Hidden submit trigger for Global Payments SDK */}
                          <button type="submit" className="gp-submit-trigger hidden">Submit</button>
                        </div>

                        {error && (
                          <div className="bg-red-900/30 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 font-bold text-sm animate-shake">
                            {error}
                          </div>
                        )}

                        <div className="bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10">
                          <p className="text-xs text-amber-200/70 leading-relaxed font-medium italic">
                            "To'lov Global Payments xavfsiz tizimi orqali amalga oshiriladi. To'lov tasdiqlanishi bilan 1 oylik premium avtomatik beriladi."
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {paymentSuccess ? (
                          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-6 text-center animate-bounce-in">
                            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-900/30">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-emerald-400 font-black">To'lov muvaffaqiyatli! Premium faollashtirildi! 🎉</p>
                          </div>
                        ) : (
                          <button
                            onClick={handleManualPaymentNotify}
                            disabled={paymentLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-900/40 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            {paymentLoading ? (
                              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Zap className="w-5 h-5 fill-current" />
                                To'lovni amalga oshirish
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

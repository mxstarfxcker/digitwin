import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Volume2, VolumeX, ArrowRight, Download, ChevronDown, Star } from "lucide-react";
import { Link } from "wouter";

// Luxury Color Palette:
// Gold: #D4AF37 (text-yellow-600/500)
// Deep Royal Blue: #0F172A (bg-slate-950)
// Emerald: #059669 (text-emerald-600)

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Parallax & Opacity Transforms
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-slate-950 text-slate-50 min-h-screen font-sans selection:bg-yellow-500/30" dir="rtl">
      
      {/* Audio Player - Minimalist Floating Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <Button 
          onClick={toggleAudio} 
          variant="outline" 
          size="icon" 
          className="rounded-full w-14 h-14 bg-slate-900/80 border-yellow-600/30 hover:bg-yellow-600/20 backdrop-blur-xl shadow-2xl transition-all duration-500"
        >
          {isPlaying ? <Volume2 className="h-6 w-6 text-yellow-500" /> : <VolumeX className="h-6 w-6 text-slate-400" />}
        </Button>
        <audio ref={audioRef} src="https://files.manuscdn.com/user_upload_by_module/session_file/111392963/WIDpftfiTAoazNmi.m4a" loop />
      </div>

      {/* Section 1: Cinematic Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img src="/assets/e0e7b6a0-f50c-11f0-a308-7351e4744707.webp" className="w-full h-full object-cover opacity-80 scale-105" alt="Hero Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/50 to-slate-950" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />
        
        {/* Decorative Islamic Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] mix-blend-overlay pointer-events-none" />

        <motion.div 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="mb-6 flex justify-center">
               <span className="px-4 py-1 border border-yellow-500/30 rounded-full text-yellow-500 text-sm tracking-widest uppercase bg-yellow-500/5 backdrop-blur-sm">
                 مستقبل الضيافة الفاخرة
               </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white tracking-tight leading-tight drop-shadow-2xl">
              التوأم الرقمي <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">
                للفنادق الذكية
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
              حيث تلتقي عراقة التصميم الأندلسي مع عبقرية الذكاء الاصطناعي
              <br />
              لخلق تجربة ضيافة لا تُنسى في قلب قطر 2030.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/digital-twin">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-10 py-8 text-xl rounded-none border border-yellow-400/20 shadow-[0_0_40px_rgba(202,138,4,0.3)] transition-all hover:scale-105 font-bold tracking-wide">
                  <Play className="ml-3 h-6 w-6 fill-current" />
                  دخول النظام الملكي
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-white/5 px-8 py-8 text-lg rounded-none border-b border-transparent hover:border-white/30 transition-all"
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
              >
                استكشف المعرض
                <ChevronDown className="mr-2 h-5 w-5 animate-bounce" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: The Visual Gallery (Extracted Slides) */}
      <section id="gallery" className="py-32 relative">
        {/* Background Image 1 */}
        <div className="absolute inset-0">
          <img src="/assets/de75cc40-f50c-11f0-a308-7351e4744707.png" className="w-full h-full object-cover opacity-10" alt="Background" />
          <div className="absolute inset-0 bg-slate-950/95" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              <span className="border-b-2 border-yellow-600 pb-2">رؤية بصرية</span> للمستقبل
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              جولة بصرية في تفاصيل المشروع، من البنية التحتية الذكية إلى تجربة النزيل الفائقة.
            </p>
          </div>

          {/* Masonry-style Grid for Slides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/111392963/jWNxAvoCKgJNhlZL.png", title: "الرؤية الشاملة", desc: "تكامل الأنظمة في منصة واحدة" },
              { src: "/assets/slides/slide-005.png", title: "الذكاء الاصطناعي", desc: "تحليل البيانات للتنبؤ بالاحتياجات" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/111392963/jiSTahYpIcHBngTl.png", title: "الاستدامة الذكية", desc: "توفير الطاقة دون المساس بالراحة" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/111392963/JYAEkRTHziIRHeFQ.png", title: "تجربة النزيل", desc: "تخصيص فائق لكل تفضيل" },
              { src: "/assets/slides/slide-015.png", title: "لوحة التحكم", desc: "مراقبة حية لكل زاوية" },
              { src: "https://files.manuscdn.com/user_upload_by_module/session_file/111392963/VsxpunzCZmDwreVL.png", title: "المستقبل الآن", desc: "تطبيق عملي لرؤية 2030" },
            ].map((slide, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl border border-slate-800 hover:border-yellow-600/50 transition-colors duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={slide.src} 
                    alt={slide.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-bold text-white mb-1">{slide.title}</h3>
                  <p className="text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {slide.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: The Story (Elegant Text Layout) */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Image 2 */}
        <div className="absolute inset-0">
          <img src="/assets/d1bf4030-f50c-11f0-a308-7351e4744707.png" className="w-full h-full object-cover opacity-20" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/90" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-8 text-white leading-tight">
              عندما يصبح الفندق <br />
              <span className="text-yellow-500">كائناً حياً يشعر ويفكر</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-300 font-light leading-loose">
              <p>
                لم تعد الفنادق مجرد مباني من الحجر والأسمنت. بفضل تقنية <strong className="text-white">التوأم الرقمي</strong>، أصبح للفندق "جهاز عصبي" من الحساسات، و"عقل مدبر" من الذكاء الاصطناعي.
              </p>
              <p>
                هذا النظام لا يكتفي بالمراقبة، بل <strong className="text-white">يتنبأ</strong>. يعرف متى سيصل الضيف فيجهز غرفته، ويعرف متى تكون القاعة فارغة فيوفر الطاقة، ويعرف متى يحتاج المكيف للصيانة قبل أن يتعطل.
              </p>
            </div>
            
            <div className="mt-10 flex gap-4">
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="fill-current h-5 w-5" />
                <span className="font-bold">كفاءة تشغيلية</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="fill-current h-5 w-5" />
                <span className="font-bold">رفاهية مطلقة</span>
              </div>
              <div className="w-px h-6 bg-slate-700" />
              <div className="flex items-center gap-2 text-yellow-500">
                <Star className="fill-current h-5 w-5" />
                <span className="font-bold">استدامة حقيقية</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-yellow-600/20 blur-3xl rounded-full opacity-40" />
            <img 
              src="/assets/e4e06810-f50c-11f0-a308-7351e4744707.webp" 
              alt="Infographic" 
              className="relative rounded-lg shadow-2xl border border-slate-700 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Section 4: Downloads & Resources (Minimalist) */}
      <section className="py-24 relative border-t border-slate-900">
        {/* Background Image 3 */}
        <div className="absolute inset-0">
          <img src="/assets/8e46c260-f50c-11f0-a308-7351e4744707.png" className="w-full h-full object-cover opacity-10" alt="Background" />
          <div className="absolute inset-0 bg-slate-950/95" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-12 text-white">المصادر والوثائق</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/assets/research_paper.pdf" download className="group">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl hover:border-yellow-600/50 transition-all hover:bg-slate-800">
                <Download className="h-8 w-8 text-yellow-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">البحث العلمي الكامل</h3>
                <p className="text-sm text-slate-400">PDF - تفاصيل تقنية وأكاديمية</p>
              </div>
            </a>
            
            <Link href="/digital-twin" className="group">
              <div className="bg-gradient-to-br from-yellow-900/20 to-slate-900 border border-yellow-600/30 p-8 rounded-xl hover:border-yellow-500 transition-all">
                <Play className="h-8 w-8 text-yellow-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-white mb-2">النظام التفاعلي</h3>
                <p className="text-sm text-slate-400">تجربة المحاكاة الحية</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-center border-t border-slate-900">
        <p className="text-slate-500 text-sm">
          © 2026 نظام التوأم الرقمي للفنادق الذكية. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}

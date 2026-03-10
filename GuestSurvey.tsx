import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSimulation } from "@/contexts/SimulationContext";
import { useLocation } from "wouter";
import { CheckCircle2, ArrowRight, ArrowLeft, Hotel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const QUESTIONS = [
  {
    id: 1,
    question: "ما هو الهدف الرئيسي من زيارتك؟",
    options: [
      { value: "medical", label: "العلاج والاستشفاء", type: "العافية الطبية (Medical Wellness Package)" },
      { value: "leisure", label: "الاسترخاء والهدوء", type: "الروحانية والتأمل (Spiritual & Retreat Package)" },
      { value: "business", label: "العمل عن بعد", type: "الرحالة الرقمي (Digital Nomad Package)" },
      { value: "shopping", label: "التسوق والترفيه", type: "متعة التسوق (Shopping Indulgence Package)" },
      { value: "gaming", label: "الألعاب والتقنية", type: "الألعاب والتقنية (Gamers & Tech Package)" }
    ]
  },
  {
    id: 2,
    question: "ما هي الأجواء التي تفضلها في غرفتك؟",
    options: [
      { value: "quiet", label: "هادئة وناعمة", type: "العافية الطبية (Medical Wellness Package)" },
      { value: "tech", label: "إضاءة خافتة وتقنية", type: "الألعاب والتقنية (Gamers & Tech Package)" },
      { value: "bright", label: "ساطعة ومشرقة", type: "متعة التسوق (Shopping Indulgence Package)" },
      { value: "nature", label: "طبيعية ومنعشة", type: "صديق للبيئة (Eco-Friendly Package)" },
      { value: "luxury", label: "فاخرة وخصوصية", type: "الخصوصية والفخامة (Privacy & Prestige Package)" }
    ]
  },
  {
    id: 3,
    question: "ما هي الخدمات الإضافية التي تهمك؟",
    options: [
      { value: "fitness", label: "أدوات رياضة ولياقة", type: "الرياضة واللياقة (Sports & Fitness Package)" },
      { value: "food", label: "تجربة طعام مميزة", type: "فن الطهي (Gastronomy Package)" },
      { value: "culture", label: "استكشاف الثقافة المحلية", type: "المستكشف الثقافي (Cultural Explorer Package)" },
      { value: "privacy", label: "خصوصية تامة", type: "الخصوصية والفخامة (Privacy & Prestige Package)" },
      { value: "work", label: "تجهيزات مكتبية", type: "الرحالة الرقمي (Digital Nomad Package)" }
    ]
  }
];

export default function GuestSurvey() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const { addGuest } = useSimulation();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const handleOptionSelect = (value: string) => {
    setAnswers(prev => ({ ...prev, [step]: value }));
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      finishSurvey();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const finishSurvey = () => {
    // Simple logic: Find the most frequent type selected
    // In a real app, this would be more complex weighted logic
    const typeCounts: Record<string, number> = {};
    
    Object.values(answers).forEach(answerValue => {
      // Find the type associated with this answer value in the current question context
      // This is a simplification; ideally we'd track the type directly
      // Let's re-find the type from the options
      QUESTIONS.forEach(q => {
        const option = q.options.find(o => o.value === answerValue);
        if (option) {
          typeCounts[option.type] = (typeCounts[option.type] || 0) + 1;
        }
      });
    });

    // Find the type with the highest count
    let bestType = "العافية الطبية (Medical Wellness Package)"; // Default
    let maxCount = 0;

    Object.entries(typeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestType = type;
      }
    });

    // If tie or low confidence, default to the answer of the first question (Main Goal)
    if (maxCount <= 1) {
       const firstAnswer = answers[0];
       const firstQOption = QUESTIONS[0].options.find(o => o.value === firstAnswer);
       if (firstQOption) bestType = firstQOption.type;
    }

    addGuest(bestType);
    toast({
      title: "تم تحليل تفضيلاتك بنجاح!",
      description: `بناءً على إجاباتك، تم اختيار باقة: ${bestType.split('(')[0]}`,
    });
    setLocation("/digital-twin");
  };

  const currentQuestion = QUESTIONS[step];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-800 text-slate-200 shadow-2xl">
        <CardHeader className="text-center border-b border-slate-800 pb-6">
          <div className="mx-auto w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
            <Hotel className="w-6 h-6 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white">استبيان تفضيلات الإقامة</CardTitle>
          <CardDescription className="text-slate-400">
            ساعدنا في تخصيص غرفتك المثالية من خلال الإجابة على 3 أسئلة بسيطة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 pb-8">
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>السؤال {step + 1} من {QUESTIONS.length}</span>
              <span>{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-500 ease-out"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300" key={step}>
            <h3 className="text-xl font-medium text-white text-center">{currentQuestion.question}</h3>
            
            <RadioGroup onValueChange={handleOptionSelect} value={answers[step]} className="space-y-3">
              {currentQuestion.options.map((option) => (
                <div key={option.value} className={`flex items-center space-x-2 space-x-reverse rounded-lg border p-4 cursor-pointer transition-all hover:bg-slate-800 ${answers[step] === option.value ? 'border-purple-500 bg-purple-900/20' : 'border-slate-700 bg-slate-950/50'}`}>
                  <RadioGroupItem value={option.value} id={option.value} className="border-slate-500 text-purple-500" />
                  <Label htmlFor={option.value} className="flex-grow cursor-pointer text-slate-200 font-normal mr-2">
                    {option.label}
                  </Label>
                  {answers[step] === option.value && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 0}
            className="text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            السابق
          </Button>
          
          <Button 
            onClick={handleNext} 
            disabled={!answers[step]}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            {step === QUESTIONS.length - 1 ? "إنهاء وتخصيص الغرفة" : "التالي"}
            {step < QUESTIONS.length - 1 && <ArrowLeft className="w-4 h-4 mr-2" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

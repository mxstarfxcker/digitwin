import random
import time
import sys

# Simulated AI Models for Demonstration
# In a real production environment, these would load the trained .pkl or .h5 files

def predict_energy(temp, occupancy):
    """
    Simulates the Energy Prediction Model (Linear Regression based).
    Formula derived from training data patterns: 
    Energy = Base + (Temp * Factor1) + (Occupancy * Factor2)
    """
    base_load = 1000  # Base kWh
    temp_factor = 50  # kWh per degree
    occupancy_factor = 15 # kWh per % occupancy
    
    # Add some random noise to simulate real-world variance
    noise = random.uniform(-50, 50)
    
    prediction = base_load + (temp * temp_factor) + (occupancy * occupancy_factor) + noise
    return round(prediction, 2)

def classify_preference(text):
    """
    Simulates the Guest Preference Classification Model (NLP).
    Uses keyword matching to simulate the trained MARBERTv2 model's behavior.
    """
    categories = {
        "فنون الطهي": ["طعام", "أكل", "مطعم", "عشاء", "غداء", "فطور", "لذيذ", "شيف", "بوفيه", "مطبخ"],
        "رياضة ولياقة": ["جيم", "رياضة", "سباحة", "مسبح", "تمرين", "لياقة", "ركض", "نادي", "صحي"],
        "استرخاء وسبا": ["سبا", "مساج", "هدوء", "راحة", "استرخاء", "ساونا", "جاكوزي", "علاج"],
        "ثقافة وفنون": ["متحف", "فن", "تاريخ", "ثقافة", "معرض", "رسم", "تراث", "جولة"],
        "أعمال ومؤتمرات": ["اجتماع", "عمل", "مؤتمر", "قاعة", "إنترنت", "واي فاي", "طباعة", "مكتب"],
        "عائلة وأطفال": ["أطفال", "عائلة", "لعب", "حضانة", "سرير إضافي", "ألعاب", "حديقة"],
        "تسوق وموضة": ["تسوق", "مول", "شراء", "ماركات", "سوق", "هدايا", "ملابس"],
        "مغامرة واستكشاف": ["رحلة", "سفاري", "صحراء", "غوص", "استكشاف", "جولة", "خارجية"]
    }
    
    text_lower = text.lower()
    scores = {cat: 0 for cat in categories}
    
    for cat, keywords in categories.items():
        for keyword in keywords:
            if keyword in text_lower:
                scores[cat] += 1
    
    # Find category with max score
    best_category = max(scores, key=scores.get)
    
    # If no keywords found, return "عام"
    if scores[best_category] == 0:
        return "تفضيلات عامة", 0.50
        
    # Simulate confidence score
    confidence = 0.75 + (scores[best_category] * 0.05)
    confidence = min(confidence, 0.99)
    
    return best_category, confidence

def main():
    print("\n" + "="*60)
    print("   نظام التوأم الرقمي للفندق - واجهة اختبار نماذج الذكاء الاصطناعي")
    print("   Digital Twin Hotel System - AI Models Test Interface")
    print("="*60 + "\n")

    while True:
        print("\nاختر النموذج الذي تريد اختباره:")
        print("1. نموذج التنبؤ باستهلاك الطاقة (Energy Prediction Model)")
        print("2. نموذج تصنيف تفضيلات النزلاء (Guest Preference Classifier)")
        print("3. خروج (Exit)")
        
        choice = input("\nأدخل رقم الخيار (1-3): ")
        
        if choice == '1':
            print("\n--- اختبار نموذج الطاقة ---")
            try:
                temp = float(input("أدخل درجة الحرارة الخارجية المتوقعة (C°): "))
                occupancy = float(input("أدخل نسبة الإشغال المتوقعة (%): "))
                
                print("\nجاري المعالجة...", end="", flush=True)
                time.sleep(1) # Simulate processing time
                
                result = predict_energy(temp, occupancy)
                print(f"\n\n>> استهلاك الطاقة المتوقع: {result} كيلوواط/ساعة")
                
                if result > 3000:
                    print("   (تنبيه: الاستهلاك مرتفع، يوصى بتفعيل وضع توفير الطاقة)")
                elif result < 1500:
                    print("   (الاستهلاك ضمن المعدل الطبيعي المنخفض)")
                else:
                    print("   (الاستهلاك ضمن المعدل الطبيعي المتوسط)")
                    
            except ValueError:
                print("\nخطأ: الرجاء إدخال أرقام صحيحة.")

        elif choice == '2':
            print("\n--- اختبار نموذج تفضيلات النزلاء ---")
            print("أدخل جملة تعبر عن رغبة النزيل أو ملاحظته (باللغة العربية).")
            text = input("النص: ")
            
            if text.strip():
                print("\nجاري تحليل النص...", end="", flush=True)
                time.sleep(1) # Simulate NLP processing
                
                category, confidence = classify_preference(text)
                print(f"\n\n>> التصنيف المقترح: {category}")
                print(f">> درجة الثقة: {int(confidence * 100)}%")
                
                print("\nالإجراء المقترح من النظام:")
                if category == "فنون الطهي":
                    print("   - إرسال قائمة الطعام المخصصة للغرفة.")
                    print("   - اقتراح حجز في المطعم الرئيسي.")
                elif category == "رياضة ولياقة":
                    print("   - إرسال جدول حصص النادي الرياضي.")
                    print("   - توفير مناشف ومياه إضافية.")
                elif category == "استرخاء وسبا":
                    print("   - عرض خصم 15% على جلسات المساج.")
                    print("   - تجهيز الغرفة بزيوت عطرية مهدئة.")
                else:
                    print(f"   - تسجيل التفضيل '{category}' في ملف النزيل لتحسين الخدمة مستقبلاً.")
            else:
                print("\nلم يتم إدخال نص.")

        elif choice == '3':
            print("\nشكراً لاستخدامك نظام التوأم الرقمي. وداعاً!")
            break
        else:
            print("\nخيار غير صحيح، حاول مرة أخرى.")

if __name__ == "__main__":
    main()

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, accuracy_score
import joblib
import os

# Ensure models directory exists
os.makedirs('models', exist_ok=True)

print("بدء عملية تدريب النماذج الحقيقية...")

# --- 1. Train Energy Prediction Model (Regression) ---
print("\n1. تدريب نموذج التنبؤ بالطاقة (Energy Model)...")

# Generate synthetic training data (simulating 1000 hours of operation)
np.random.seed(42)
n_samples = 1000
temps = np.random.uniform(20, 45, n_samples)  # Temperature 20-45 C
occupancy = np.random.uniform(0, 100, n_samples) # Occupancy 0-100%

# Formula: Energy = 1000 + (50 * Temp) + (15 * Occupancy) + Noise
energy_consumption = 1000 + (50 * temps) + (15 * occupancy) + np.random.normal(0, 50, n_samples)

X_energy = pd.DataFrame({'temp': temps, 'occupancy': occupancy})
y_energy = energy_consumption

# Split data
X_train_e, X_test_e, y_train_e, y_test_e = train_test_split(X_energy, y_energy, test_size=0.2, random_state=42)

# Train model
energy_model = LinearRegression()
energy_model.fit(X_train_e, y_train_e)

# Evaluate
y_pred_e = energy_model.predict(X_test_e)
mae = mean_absolute_error(y_test_e, y_pred_e)
print(f"   - تم تدريب النموذج بنجاح.")
print(f"   - متوسط الخطأ المطلق (MAE): {mae:.2f} kWh")

# Save model
joblib.dump(energy_model, 'models/energy_model.pkl')
print("   - تم حفظ النموذج في: models/energy_model.pkl")


# --- 2. Train Guest Preference Classifier (NLP) ---
print("\n2. تدريب نموذج تصنيف التفضيلات (Guest Preference Model)...")

# Create a small Arabic dataset for training
data = [
    ("أريد مطعماً يقدم أكلات شعبية", "فنون الطهي"),
    ("هل يوجد بوفيه مفتوح للعشاء؟", "فنون الطهي"),
    ("أبحث عن مكان لتناول الغداء", "فنون الطهي"),
    ("الطعام كان لذيذاً جداً", "فنون الطهي"),
    ("أريد حجز طاولة في المطعم", "فنون الطهي"),
    
    ("أين يقع النادي الرياضي؟", "رياضة ولياقة"),
    ("أريد ممارسة السباحة في المسبح", "رياضة ولياقة"),
    ("هل يوجد مدرب شخصي في الجيم؟", "رياضة ولياقة"),
    ("أحب تمارين الكارديو والركض", "رياضة ولياقة"),
    ("ما هي مواعيد فتح النادي الصحي؟", "رياضة ولياقة"),
    
    ("أحتاج إلى جلسة مساج للاسترخاء", "استرخاء وسبا"),
    ("هل يوجد ساونا وجاكوزي؟", "استرخاء وسبا"),
    ("أريد مكاناً هادئاً للراحة", "استرخاء وسبا"),
    ("علاج طبيعي وآلام الظهر", "استرخاء وسبا"),
    ("أجواء السبا رائعة جداً", "استرخاء وسبا"),
    
    ("هل هناك متاحف قريبة من الفندق؟", "ثقافة وفنون"),
    ("أحب زيارة المعارض الفنية", "ثقافة وفنون"),
    ("تاريخ قطر وتراثها", "ثقافة وفنون"),
    ("جولة سياحية ثقافية", "ثقافة وفنون"),
    ("أماكن أثرية للزيارة", "ثقافة وفنون"),

    ("عندي اجتماع عمل مهم", "أعمال ومؤتمرات"),
    ("أحتاج قاعة مؤتمرات مجهزة", "أعمال ومؤتمرات"),
    ("هل الإنترنت سريع للعمل؟", "أعمال ومؤتمرات"),
    ("خدمات رجال الأعمال والطباعة", "أعمال ومؤتمرات"),
    ("مكتب للعمل عن بعد", "أعمال ومؤتمرات"),
]

# Duplicate data to increase sample size for TF-IDF stability
data = data * 20 

df_nlp = pd.DataFrame(data, columns=['text', 'category'])

# Pipeline: TF-IDF Vectorizer -> Logistic Regression
nlp_model = make_pipeline(
    TfidfVectorizer(),
    LogisticRegression(random_state=42)
)

# Train model
nlp_model.fit(df_nlp['text'], df_nlp['category'])

# Evaluate (on training data for this small demo)
accuracy = nlp_model.score(df_nlp['text'], df_nlp['category'])
print(f"   - تم تدريب النموذج بنجاح.")
print(f"   - دقة النموذج (Accuracy): {accuracy*100:.2f}%")

# Save model
joblib.dump(nlp_model, 'models/nlp_model.pkl')
print("   - تم حفظ النموذج في: models/nlp_model.pkl")

print("\nاكتملت العملية! النماذج جاهزة للاستخدام.")

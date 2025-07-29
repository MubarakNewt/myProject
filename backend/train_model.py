import pandas as pd
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.compose import ColumnTransformer
from sklearn.model_selection import train_test_split
from sklearn.feature_selection import mutual_info_classif
from imblearn.over_sampling import SMOTE
import joblib
import os

# Load dataset
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
columns = ['age','sex','cp','trestbps','chol','fbs','restecg',
           'thalach','exang','oldpeak','slope','ca','thal','target']
df = pd.read_csv(url, names=columns, na_values='?')
df['target'] = (df['target'] > 0).astype(int)
df.dropna(inplace=True)

X = df.drop('target', axis=1)
y = df['target']

num_cols = ['age','trestbps','chol','thalach','oldpeak']
cat_cols = [col for col in X.columns if col not in num_cols]

num_pipe = Pipeline([('impute', SimpleImputer()), ('scale', MinMaxScaler())])
cat_pipe = Pipeline([('impute', SimpleImputer(strategy='most_frequent')),
                     ('encode', OneHotEncoder(handle_unknown='ignore'))])

preprocessor = ColumnTransformer([('num', num_pipe, num_cols),
                                  ('cat', cat_pipe, cat_cols)])

X_pre = preprocessor.fit_transform(X)
mi = mutual_info_classif(X_pre, y)
selected_indices = np.argsort(mi)[-8:]

X_sel = X_pre[:, selected_indices]

X_resampled, y_resampled = SMOTE(random_state=42).fit_resample(X_sel, y)

model = LogisticRegression(max_iter=1000, penalty='elasticnet',
                           solver='saga', l1_ratio=0.5)
model.fit(X_resampled, y_resampled)

os.makedirs("model", exist_ok=True)
os.makedirs("preprocess", exist_ok=True)

joblib.dump(model, "model/model.pkl")
joblib.dump(preprocessor, "preprocess/pipeline.pkl")
joblib.dump(selected_indices, "model/mi_indices.pkl")

print("✅ Model and pipeline saved!")

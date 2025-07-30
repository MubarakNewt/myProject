export interface PatientData {
    age: number;
    sex: number;
    cp: number;
    trestbps: number;
    chol: number;
    fbs: number;
    restecg: number;
    thalach: number;
    exang: number;
    oldpeak: number;
    slope: number;
    ca: number;
    thal: number;
  }
  
  export interface PredictionResponse {
    prediction: number;
    probability: number;
    error?: string;
  }
  
  const API_BASE_URL = "https://mypj.fly.dev"; // ✅ Your live backend!
  
  export const predictHeartDisease = async (patientData: PatientData): Promise<PredictionResponse> => {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
    });
  
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  
    return response.json();
  };
  
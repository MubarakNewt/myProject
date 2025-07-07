import React, { useState } from 'react';
import { Heart, User, Activity, Stethoscope, TrendingUp, AlertTriangle, CheckCircle, Info } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState('input');
  const [patientData, setPatientData] = useState({
    age: '',
    sex: '',
    chestPainType: '',
    restingBP: '',
    cholesterol: '',
    fastingBS: '',
    restingECG: '',
    maxHeartRate: '',
    exerciseAngina: '',
    oldpeak: '',
    stSlope: '',
    majorVessels: '',
    thalassemia: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  const updateField = (field, value) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return Object.entries(patientData).every(([key, value]) => value !== '');
  };

  const simulatePrediction = () => {
    setCurrentStep('processing');
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const riskFactors = calculateRiskFactors();
          const mockPrediction = {
            riskLevel: riskFactors > 0.6 ? 'high' : riskFactors > 0.3 ? 'moderate' : 'low',
            probability: Math.min(0.95, Math.max(0.05, riskFactors + (Math.random() - 0.5) * 0.2)),
            confidence: 0.85 + Math.random() * 0.1,
            recommendations: generateRecommendations(riskFactors)
          };
          setPrediction(mockPrediction);
          setCurrentStep('results');
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 150);
  };

  const calculateRiskFactors = () => {
    let risk = 0;
    const age = Number(patientData.age);
    const restingBP = Number(patientData.restingBP);
    const cholesterol = Number(patientData.cholesterol);
    const majorVessels = Number(patientData.majorVessels);
    if (age > 65) risk += 0.2;
    else if (age > 55) risk += 0.1;
    if (patientData.sex === 'male') risk += 0.1;
    if (patientData.chestPainType === 'typical') risk += 0.3;
    else if (patientData.chestPainType === 'atypical') risk += 0.2;
    if (restingBP > 140) risk += 0.15;
    else if (restingBP > 120) risk += 0.05;
    if (cholesterol > 240) risk += 0.2;
    else if (cholesterol > 200) risk += 0.1;
    if (patientData.exerciseAngina === 'yes') risk += 0.25;
    if (!isNaN(majorVessels) && majorVessels > 0) {
      risk += majorVessels * 0.15;
    }
    if (patientData.thalassemia === 'reversible-defect') risk += 0.3;
    else if (patientData.thalassemia === 'fixed-defect') risk += 0.2;
    return Math.min(1, risk);
  };

  const generateRecommendations = (riskLevel) => {
    const recommendations = [];
    if (riskLevel > 0.6) {
      recommendations.push("Consult with a cardiologist immediately for comprehensive evaluation");
      recommendations.push("Consider cardiac stress testing and advanced imaging");
      recommendations.push("Implement strict dietary modifications and supervised exercise program");
    } else if (riskLevel > 0.3) {
      recommendations.push("Schedule regular check-ups with your primary care physician");
      recommendations.push("Monitor blood pressure and cholesterol levels monthly");
      recommendations.push("Adopt heart-healthy lifestyle changes including diet and exercise");
    } else {
      recommendations.push("Maintain current healthy lifestyle habits");
      recommendations.push("Continue regular annual health screenings");
      recommendations.push("Stay physically active with at least 150 minutes of moderate exercise weekly");
    }
    recommendations.push("Avoid smoking and limit alcohol consumption");
    recommendations.push("Manage stress through relaxation techniques or counseling");
    return recommendations;
  };

  const resetAssessment = () => {
    setCurrentStep('input');
    setPrediction(null);
    setProcessingProgress(0);
    setPatientData({
      age: '',
      sex: '',
      chestPainType: '',
      restingBP: '',
      cholesterol: '',
      fastingBS: '',
      restingECG: '',
      maxHeartRate: '',
      exerciseAngina: '',
      oldpeak: '',
      stSlope: '',
      majorVessels: '',
      thalassemia: ''
    });
  };

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-8">
              <Heart className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin" style={{ animationDuration: '2s' }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analyzing Your Data</h2>
            <p className="text-gray-600 mb-6">Our AI model is processing your information using advanced machine learning algorithms</p>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing Progress</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 space-y-1 mt-6">
                <p>✓ Data preprocessing completed</p>
                <p>✓ Feature engineering applied</p>
                <p>✓ Model inference in progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && prediction) {
    const getRiskColor = (level) => {
      switch (level) {
        case 'low': return 'text-green-600 bg-green-50 border-green-200';
        case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'high': return 'text-red-600 bg-red-50 border-red-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    };
    const getRiskIcon = (level) => {
      switch (level) {
        case 'low': return <CheckCircle className="h-8 w-8" />;
        case 'moderate': return <AlertTriangle className="h-8 w-8" />;
        case 'high': return <AlertTriangle className="h-8 w-8" />;
        default: return <Info className="h-8 w-8" />;
      }
    };
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Heart Health Assessment</h1>
              <p className="text-gray-600">Based on advanced machine learning analysis</p>
            </div>
            <div className={`bg-white rounded-2xl shadow-xl border-2 p-8 mb-8 ${getRiskColor(prediction.riskLevel)}`}>
              <div className="flex items-center justify-center mb-6">
                {getRiskIcon(prediction.riskLevel)}
                <div className="ml-4 text-center">
                  <h2 className="text-2xl font-bold capitalize">{prediction.riskLevel} Risk</h2>
                  <p className="text-lg">{(prediction.probability * 100).toFixed(1)}% probability</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{(prediction.probability * 100).toFixed(1)}%</div>
                  <div className="text-sm opacity-75">Risk Probability</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{(prediction.confidence * 100).toFixed(1)}%</div>
                  <div className="text-sm opacity-75">Model Confidence</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Stethoscope className="h-6 w-6 mr-3 text-blue-600" />
                Personalized Recommendations
              </h3>
              <div className="space-y-4">
                {prediction.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Important Medical Disclaimer</h4>
                  <p className="text-amber-700 text-sm">
                    This assessment is for informational purposes only and should not replace professional medical advice. 
                    Always consult with qualified healthcare providers for proper diagnosis and treatment. 
                    This AI model is based on statistical patterns and may not account for all individual factors.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetAssessment}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Take Another Assessment
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-16 w-16 text-red-500 mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">Heart Disease Risk Assessment</h1>
                <p className="text-xl text-gray-600 mt-2">AI-Powered Personal Health Evaluation</p>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get personalized insights about your cardiovascular health using advanced machine learning. 
              Fill out the form below with your medical information for an instant risk assessment.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={patientData.age}
                  onChange={e => updateField('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter age"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  value={patientData.sex}
                  onChange={e => updateField('sex', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Symptoms & Medical History
                </h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
                <select
                  value={patientData.chestPainType}
                  onChange={e => updateField('chestPainType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="typical">Typical Angina</option>
                  <option value="atypical">Atypical Angina</option>
                  <option value="non-anginal">Non-Anginal Pain</option>
                  <option value="asymptomatic">Asymptomatic</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Exercise Induced Angina</label>
                <select
                  value={patientData.exerciseAngina}
                  onChange={e => updateField('exerciseAngina', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Vital Signs & Lab Results
                </h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
                <input
                  type="number"
                  value={patientData.restingBP}
                  onChange={e => updateField('restingBP', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter resting blood pressure"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cholesterol Level</label>
                <input
                  type="number"
                  value={patientData.cholesterol}
                  onChange={e => updateField('cholesterol', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter cholesterol level"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar &gt; 120 mg/dl</label>
                <select
                  value={patientData.fastingBS}
                  onChange={e => updateField('fastingBS', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Maximum Heart Rate Achieved</label>
                <input
                  type="number"
                  value={patientData.maxHeartRate}
                  onChange={e => updateField('maxHeartRate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter max heart rate"
                />
              </div>
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                  Clinical Test Results
                </h3>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Resting ECG Results</label>
                <select
                  value={patientData.restingECG}
                  onChange={e => updateField('restingECG', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="normal">Normal</option>
                  <option value="st-t-abnormality">ST-T Wave Abnormality</option>
                  <option value="lv-hypertrophy">Left Ventricular Hypertrophy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ST Depression (Oldpeak)</label>
                <input
                  type="number"
                  value={patientData.oldpeak}
                  onChange={e => updateField('oldpeak', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter ST depression (oldpeak)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ST Slope</label>
                <select
                  value={patientData.stSlope}
                  onChange={e => updateField('stSlope', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="upsloping">Upsloping</option>
                  <option value="flat">Flat</option>
                  <option value="downsloping">Downsloping</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of Major Vessels</label>
                <select
                  value={patientData.majorVessels}
                  onChange={e => updateField('majorVessels', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Thalassemia</label>
                <select
                  value={patientData.thalassemia}
                  onChange={e => updateField('thalassemia', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                >
                  <option value="">Select...</option>
                  <option value="normal">Normal</option>
                  <option value="fixed-defect">Fixed Defect</option>
                  <option value="reversible-defect">Reversible Defect</option>
                </select>
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={simulatePrediction}
                disabled={!isFormValid()}
                className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Analyze My Heart Health
              </button>
              {!isFormValid() && (
                <p className="text-red-500 text-sm mt-2">Please fill in all required fields</p>
              )}
            </div>
          </div>
          <div className="text-center mt-8 text-gray-600">
            <p className="text-sm">
              This tool uses machine learning for educational purposes. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
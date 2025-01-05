// App.js
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from './components/ui/Card';
import CardContent from './components/ui/CardContent';
import Alert from './components/ui/Alert';
import { Camera, Activity, Calculator, TrendingUp, Leaf, AlertTriangle, CheckCircle, Upload, Settings } from 'lucide-react';

// Utility Functions
const generateMonitorData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: `${i}s`,
    value1: 45 + Math.random() * 5,
    value2: 1.2 + Math.random() * 0.2
  }));
};

const calculateROI = (biomassData) => {
  const processingCost = 100; // Cost per ton
  const biosynctCost = 60; // Cost per ton with BioSync
  const biofuelPrice = 800; // Price per ton
  const conversionRate = biomassData.moisture < 30 ? 0.6 : 0.4;

  const estimatedVolume = biomassData.size * 20;
  const qualityMultiplier = biomassData.quality === 'Good' ? 1 : 0.8;

  const processingCostSavings = (processingCost - biosynctCost) * estimatedVolume;
  const biofuelOutput = estimatedVolume * conversionRate * qualityMultiplier;
  const biofuelRevenue = biofuelOutput * biofuelPrice;
  const carbonReduction = estimatedVolume * 2.5;

  return {
    monthlySavings: processingCostSavings,
    annualSavings: processingCostSavings * 12,
    biofuelRevenue: biofuelRevenue,
    carbonReduction: carbonReduction,
    efficiency: (conversionRate * 100).toFixed(1)
  };
};

const generateRecommendation = (results) => {
  let status = 'optimal';
  let actions = [];
  let processingType = 'Direct Processing';

  if (results.moisture > 30) {
    status = 'warning';
    actions.push('Pre-dry biomass to reduce moisture content below 30%');
    processingType = 'Pre-treatment Required';
  }

  if (results.size > 50) {
    status = 'warning';
    actions.push('Reduce particle size to 30-40mm for optimal conversion');
  }

  if (results.energy < 1000) {
    status = 'warning';
    actions.push('Consider blending with higher energy content biomass');
  }

  return {
    status,
    processingType,
    actions,
    efficiency: results.moisture < 30 ? 'High (>90%)' : 'Medium (70-80%)',
    suitableFor: [
      'Biofuel Production',
      results.moisture < 25 ? 'Direct Combustion' : null,
      results.quality === 'Good' ? 'Premium Grade Bioethanol' : 'Standard Grade Bioethanol'
    ].filter(Boolean)
  };
};

const App = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [roiMetrics, setRoiMetrics] = useState(null);
  const [monitorData, setMonitorData] = useState(generateMonitorData());
  const [recommendation, setRecommendation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [simulationParams, setSimulationParams] = useState({
    moisture: 25,
    size: 40,
    quality: 'Good',
    energy: 1400
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'monitor') {
      const interval = setInterval(() => {
        setMonitorData(prev => {
          const newData = [...prev.slice(1), {
            time: '30s',
            value1: 45 + Math.random() * 5,
            value2: 1.2 + Math.random() * 0.2
          }];
          return newData;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      handleAnalyze();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      handleAnalyze();
    }
  };

  const handleSimulationChange = (param, value) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResults(simulationParams);
      setRoiMetrics(calculateROI(simulationParams));
      setRecommendation(generateRecommendation(simulationParams));
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderAnalysisResults = () => {
    if (!analysisResults) return null;

    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 bg-gray-50">
              <div className="text-gray-600">Moisture Content</div>
              <div className="text-2xl font-bold">{analysisResults.moisture}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-gray-50">
              <div className="text-gray-600">Average Size</div>
              <div className="text-2xl font-bold">{analysisResults.size}mm</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-gray-50">
              <div className="text-gray-600">Quality</div>
              <div className="text-2xl font-bold">{analysisResults.quality}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-gray-50">
              <div className="text-gray-600">Energy Potential</div>
              <div className="text-2xl font-bold">{analysisResults.energy} MJ/kg</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderROIMetrics = () => {
    if (!roiMetrics) return null;

    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Business Impact</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Monthly Savings</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ₹{roiMetrics.monthlySavings.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">Conversion Efficiency</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {roiMetrics.efficiency}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Biofuel Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                ₹{roiMetrics.biofuelRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">CO2 Reduction</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-600">
                {roiMetrics.carbonReduction.toLocaleString()} tons
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderRecommendation = () => {
    if (!recommendation) return null;

    return (
      <Card className="mt-6">
        <CardContent className={`p-4 ${
          recommendation.status === 'optimal' ? 'bg-green-50' : 'bg-yellow-50'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {recommendation.status === 'optimal' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              )}
              <h3 className="font-bold text-lg">Processing Recommendation</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-gray-700">Processing Type:</p>
                <p className="text-gray-600">{recommendation.processingType}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Expected Efficiency:</p>
                <p className="text-gray-600">{recommendation.efficiency}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700">Suitable Applications:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {recommendation.suitableFor.map((use, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white rounded-full text-sm text-gray-600 border border-gray-200"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>

            {recommendation.actions.length > 0 && (
              <div>
                <p className="font-semibold text-gray-700">Recommended Actions:</p>
                <ul className="list-disc list-inside text-gray-600 mt-1">
                  {recommendation.actions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Based on HPCL processing standards and biomass quality analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-green-400 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">BioSync Analyzer</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'scan' ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}
            onClick={() => setActiveTab('scan')}
          >
            <Camera size={20} />
            Scan
          </button>
          <button
            className={`p-4 rounded-lg flex items-center justify-center gap-2 ${
              activeTab === 'monitor' ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
            }`}
            onClick={() => setActiveTab('monitor')}
          >
            <Activity size={20} />
            Monitor
          </button>
        </div>

        {activeTab === 'scan' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={selectedImage} 
                        alt="Selected biomass" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Choose Different Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="text-gray-500">Drag and drop an image or</p>
                      <button
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Browse Files
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold">Simulation Parameters</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Moisture Content (%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simulationParams.moisture}
                        onChange={(e) => handleSimulationChange('moisture', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{simulationParams.moisture}%</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size (mm)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={simulationParams.size}
                        onChange={(e) => handleSimulationChange('size', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{simulationParams.size}mm</span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quality
                      </label>
                      <select
                        value={simulationParams.quality}
                        onChange={(e) => handleSimulationChange('quality', e.target.value)}
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Poor">Poor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Energy (MJ/kg)
                      </label>
                      <input
                        type="range"
                        min="800"
                        max="2000"
                        value={simulationParams.energy}
                        onChange={(e) => handleSimulationChange('energy', parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">{simulationParams.energy} MJ/kg</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 mt-4"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Simulation'}
                  </button>
                </div>
              </CardContent>
            </Card>

            {renderAnalysisResults()}
            {renderROIMetrics()}
            {renderRecommendation()}

            <Alert className="mt-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div>
                  <div className="font-semibold">System Status</div>
                  <div className="text-green-600">Ready for analysis</div>
                </div>
              </div>
            </Alert>
          </div>
        )}

        {activeTab === 'monitor' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Real-time Monitoring</h2>
            <Card>
              <CardContent className="p-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monitorData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="value1"
                        stroke="#10B981"
                        name="Temperature"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="value2"
                        stroke="#6B7280"
                        name="Pressure"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">System Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature</span>
                          <span className="font-medium">45.2°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pressure</span>
                          <span className="font-medium">1.2 bar</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flow Rate</span>
                          <span className="font-medium">2.5 m³/h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Process Status</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span>System Operating Normally</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Last Update: Just now
                        </div>
                        <div className="text-sm text-gray-500">
                          Uptime: 24h 30m
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

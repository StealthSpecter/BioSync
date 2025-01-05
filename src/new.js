import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, Leaf } from 'lucide-react';

const ROICalculator = () => {
  const [inputValues, setInputValues] = useState({
    biomassVolume: 1000, // tons per month
    currentProcessingCost: 100, // per ton
    biosynctProcessingCost: 60, // per ton
    biofuelPrice: 800, // per ton
    conversionRate: 0.6, // 60% conversion efficiency
  });

  const [results, setResults] = useState({
    monthlySavings: 0,
    annualSavings: 0,
    biofuelRevenue: 0,
    carbonReduction: 0,
  });

  useEffect(() => {
    const calculateROI = () => {
      const processingCostSavings = 
        (inputValues.currentProcessingCost - inputValues.biosynctProcessingCost) * 
        inputValues.biomassVolume;
      
      const biofuelOutput = inputValues.biomassVolume * inputValues.conversionRate;
      const biofuelRevenue = biofuelOutput * inputValues.biofuelPrice;
      
      // Assuming 2.5 tons of CO2 saved per ton of biomass processed
      const carbonReduction = inputValues.biomassVolume * 2.5;

      setResults({
        monthlySavings: processingCostSavings,
        annualSavings: processingCostSavings * 12,
        biofuelRevenue: biofuelRevenue,
        carbonReduction: carbonReduction,
      });
    };

    calculateROI();
  }, [inputValues]);

  return (
    <div className="p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            BioSync ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Monthly Biomass Volume (tons)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={inputValues.biomassVolume}
                onChange={(e) => setInputValues({
                  ...inputValues,
                  biomassVolume: parseFloat(e.target.value)
                })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Current Processing Cost (₹/ton)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={inputValues.currentProcessingCost}
                onChange={(e) => setInputValues({
                  ...inputValues,
                  currentProcessingCost: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">Monthly Savings</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{results.monthlySavings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Annual Savings</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{results.annualSavings.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold">Biofuel Revenue</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ₹{results.biofuelRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold">CO2 Reduction</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {results.carbonReduction.toLocaleString()} tons
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ROICalculator;

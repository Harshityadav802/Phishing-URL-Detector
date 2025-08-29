import React, { useState, useEffect } from 'react';

const App = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const topFeatures = [
        'URLTitleMatchScore', 'NoOfExternalRef_log', 'URLCharProb', 'DomainTitleMatchScore',
        'NoOfSelfRef_log', 'SpacialCharRatioInURL', 'TLDLegitimateProb', 'NoOfLettersInURL_log',
        'NoOfJS_log', 'LetterRatioInURL'
    ];

    const analyzeUrl = (e) => {
        e.preventDefault();
        if (!url) {
            setError('Please enter a URL to analyze.');
            setResult(null);
            return;
        }
        if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(url)) {
            setError('Please enter a valid URL format (e.g., https://example.com).');
            setResult(null);
            return;
        }

        setError('');
        setIsLoading(true);
        setResult(null);

        setTimeout(() => {
            const extractedFeatures = extractFeatures(url);
            const prediction = predict(extractedFeatures);
            setResult({ ...prediction, features: extractedFeatures });
            setIsLoading(false);
        }, 1500);
    };


    const extractFeatures = (inputUrl) => {
        let cleanUrl;
        try {
            cleanUrl = new URL(inputUrl.startsWith('http') ? inputUrl : `http://${inputUrl}`);
        } catch (e) {
         
            const parts = inputUrl.replace(/^(https?:\/\/)?/, '').split('/');
            const domain = parts[0];
            const path = `/${parts.slice(1).join('/')}`;
            cleanUrl = { hostname: domain, pathname: path, href: inputUrl, protocol: inputUrl.startsWith('https') ? 'https:' : 'http:' };
        }
        
        const features = {};

      
        features.URLLength = inputUrl.length;
        features.Domain = cleanUrl.hostname;
        features.DomainLength = cleanUrl.hostname.length;
        features.IsDomainIP = /(\d{1,3}\.){3}\d{1,3}/.test(cleanUrl.hostname) ? 1 : 0;
        const tldMatch = cleanUrl.hostname.match(/\.([^.]+)$/);
        features.TLD = tldMatch ? tldMatch[1] : 'com';
        features.NoOfSubDomain = cleanUrl.hostname.split('.').length - 2;
        features.NoOfLettersInURL = (inputUrl.match(/[a-zA-Z]/g) || []).length;
        features.LetterRatioInURL = features.NoOfLettersInURL / inputUrl.length;
        features.NoOfDegitsInURL = (inputUrl.match(/\d/g) || []).length;
        features.DegitRatioInURL = features.NoOfDegitsInURL / inputUrl.length;
        features.NoOfQMarkInURL = (inputUrl.match(/\?/g) || []).length;
        features.NoOfAmpersandInURL = (inputUrl.match(/&/g) || []).length;
        features.NoOfOtherSpecialCharsInURL = (inputUrl.match(/[^\w\s\.\/]/g) || []).length;
        features.SpacialCharRatioInURL = features.NoOfOtherSpecialCharsInURL / inputUrl.length;
        features.IsHTTPS = cleanUrl.protocol === 'https:' ? 1 : 0;

        features.URLTitleMatchScore = Math.random() * 0.8 + 0.1;
        features.DomainTitleMatchScore = Math.random() * 0.8 + 0.1;
        features.NoOfExternalRef = Math.floor(Math.random() * 200);
        features.NoOfSelfRef = Math.floor(Math.random() * 100);
        features.NoOfJS = Math.floor(Math.random() * 20);
        features.TLDLegitimateProb = Math.random();
        features.URLCharProb = Math.random() * 0.05 + 0.03; 
        features.NoOfExternalRef_log = Math.log1p(features.NoOfExternalRef);
        features.NoOfSelfRef_log = Math.log1p(features.NoOfSelfRef);
        features.NoOfJS_log = Math.log1p(features.NoOfJS);
        features.NoOfLettersInURL_log = Math.log1p(features.NoOfLettersInURL);

        return features;
    };

  
    const predict = (features) => {
        let phishingScore = 0;
        let legitimateScore = 0;

        
        if (features.URLTitleMatchScore < 0.5) phishingScore += 25; else legitimateScore += 25;
        if (features.NoOfExternalRef > 100) phishingScore += 20; else legitimateScore += 20;
        if (features.SpacialCharRatioInURL > 0.1) phishingScore += 15; else legitimateScore += 15;
        if (features.TLDLegitimateProb < 0.2) phishingScore += 15; else legitimateScore += 15;
        if (!features.IsHTTPS) phishingScore += 10; else legitimateScore += 10;
        if (features.URLLength > 75) phishingScore += 5; else legitimateScore += 5;
        if (features.NoOfDegitsInURL > 5) phishingScore += 5; else legitimateScore += 5;
        if (features.IsDomainIP) phishingScore += 5; else legitimateScore += 5;

        const totalScore = phishingScore + legitimateScore;
        const phishingProbability = (phishingScore / totalScore) * 100;
        const legitimateProbability = (legitimateScore / totalScore) * 100;

        const isPhishing = phishingProbability > 50;

        return {
            status: isPhishing ? 'Phishing' : 'Legitimate',
            phishingProbability: phishingProbability.toFixed(2),
            legitimateProbability: legitimateProbability.toFixed(2),
        };
    };

    const ResultCard = ({ result }) => {
        const isPhishing = result.status === 'Phishing';
        const cardColor = isPhishing ? 'bg-red-100 border-red-500' : 'bg-green-100 border-green-500';
        const textColor = isPhishing ? 'text-red-800' : 'text-green-800';
        const icon = isPhishing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        );

        return (
            <div className={`mt-8 p-6 rounded-lg border-l-4 shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105 ${cardColor} ${textColor}`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="ml-4">
                        <h3 className="text-2xl font-bold">This URL is likely <span className={isPhishing ? 'text-red-600' : 'text-green-600'}>{result.status}</span></h3>
                        <p className="mt-1 text-sm">Based on our simulated analysis, we've determined the following probabilities:</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-around text-center">
                    <div>
                        <p className="text-4xl font-bold text-green-600">{result.legitimateProbability}%</p>
                        <p className="text-sm font-medium">Legitimate</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-red-600">{result.phishingProbability}%</p>
                        <p className="text-sm font-medium">Phishing</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h4 className="font-bold text-lg">Key Feature Analysis (Simulated)</h4>
                    <p className="text-xs text-gray-600 mb-3">These are some of the most influential features identified by the model.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {topFeatures.slice(0, 6).map(feature => (
                            <div key={feature} className="bg-white/60 p-3 rounded-md shadow-sm">
                                <span className="font-semibold">{feature}:</span>
                                <span className="ml-2 font-mono">{typeof result.features[feature] === 'number' ? result.features[feature].toFixed(4) : result.features[feature]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <p className="text-xs text-center mt-6 text-gray-500 italic">
                    Disclaimer: This is a demonstration. The prediction is based on a simplified model and trained data, not live web content analysis.
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col items-center p-4">
            <div className="w-full max-w-3xl mx-auto">
                <header className="text-center my-8">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Phishing URL <span className="text-blue-600">Detector</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        Enter a URL to analyze its likelyhood of  being a phishing attempt. Our tool uses a simulated machine learning model based on key predictive features.
                    </p>
                </header>

                <main>
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <form onSubmit={analyzeUrl}>
                            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
                                URL to Analyze
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    id="url-input"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="e.g., example-bank-login.com"
                                    className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </>
                                    ) : 'Analyze'}
                                </button>
                            </div>
                        </form>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </div>

                    {result && <ResultCard result={result} />}
                </main>
            </div>
             <footer className="text-center py-8 mt-auto">
                <p className="text-gray-500 text-sm">Built to demonstrate the Phishing URL Detection model.</p>
            </footer>
        </div>
    );
};

export default App;

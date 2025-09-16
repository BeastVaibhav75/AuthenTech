/**
 * Utility functions for AI-based forgery detection using OCR
 */
import Tesseract from 'tesseract.js';

/**
 * Analyzes an image for potential forgery using OCR and image analysis techniques
 * @param file The file to analyze
 * @returns Promise with analysis results
 */
export async function detectForgery(file: File): Promise<{
  isForged: boolean;
  confidence: number;
  details: string[];
}> {
  try {
    // Convert file to image data URL for Tesseract
    const imageDataUrl = await fileToDataUrl(file);
    
    // Perform OCR to extract text from the document
    const { text, confidence } = await performOCR(imageDataUrl);
    
    // Analyze the document for potential forgery indicators
    const analysisResults = analyzeDocument(text, confidence);
    
    return analysisResults;
  } catch (error) {
    console.error('Error in forgery detection:', error);
    return {
      isForged: false,
      confidence: 0,
      details: ['Error analyzing document. Please try again.']
    };
  }
}

/**
 * Converts a file to a data URL
 * @param file The file to convert
 * @returns Promise with the data URL
 */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Performs OCR on an image to extract text
 * @param imageDataUrl The image data URL
 * @returns Promise with OCR results
 */
async function performOCR(imageDataUrl: string): Promise<{ text: string; confidence: number }> {
  try {
    const result = await Tesseract.recognize(
      imageDataUrl,
      'eng', // Language
      {
        logger: m => console.log(m) // Optional logger for debugging
      }
    );
    
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error('OCR processing failed');
  }
}

/**
 * Analyzes document text for potential forgery indicators
 * @param text The extracted text from OCR
 * @param ocrConfidence The OCR confidence score
 * @returns Analysis results
 */
function analyzeDocument(text: string, ocrConfidence: number): {
  isForged: boolean;
  confidence: number;
  details: string[];
} {
  const details: string[] = [];
  let forgeryScore = 0;
  let maxForgeryScore = 0;
  
  // Check OCR confidence (low confidence might indicate tampering)
  maxForgeryScore += 30;
  if (ocrConfidence < 70) {
    forgeryScore += 30 * (1 - ocrConfidence / 100);
    details.push(`Low text recognition confidence (${ocrConfidence.toFixed(1)}%)`);
  }
  
  // Check for inconsistent fonts or formatting (simplified simulation)
  maxForgeryScore += 20;
  const fontInconsistencyScore = simulateFontAnalysis(text);
  forgeryScore += fontInconsistencyScore;
  if (fontInconsistencyScore > 5) {
    details.push('Potential inconsistent fonts or formatting detected');
  }
  
  // Check for unusual text patterns or inconsistencies
  maxForgeryScore += 25;
  const textPatternScore = detectSuspiciousTextPatterns(text);
  forgeryScore += textPatternScore;
  if (textPatternScore > 5) {
    details.push('Suspicious text patterns detected');
  }
  
  // Check for digital manipulation indicators
  maxForgeryScore += 25;
  const digitalManipulationScore = simulateDigitalManipulationCheck();
  forgeryScore += digitalManipulationScore;
  if (digitalManipulationScore > 5) {
    details.push('Potential digital manipulation detected');
  }
  
  // Calculate overall confidence (inverse of forgery likelihood)
  const forgeryLikelihood = forgeryScore / maxForgeryScore;
  const authenticityConfidence = 100 * (1 - forgeryLikelihood);
  
  // Determine if the document is likely forged
  const isForged = forgeryLikelihood > 0.4; // Threshold for forgery detection
  
  if (details.length === 0) {
    details.push('No forgery indicators detected');
  }
  
  return {
    isForged,
    confidence: authenticityConfidence,
    details
  };
}

/**
 * Simulates font analysis for inconsistencies
 * In a real implementation, this would use image processing to detect font variations
 * @param text The document text
 * @returns A score indicating potential font inconsistencies
 */
function simulateFontAnalysis(text: string): number {
  // This is a simplified simulation
  // In a real implementation, this would analyze pixel patterns, font metrics, etc.
  
  // For demo purposes, we'll return a random score weighted by text length
  // Longer text has more chance of having inconsistencies
  const textComplexity = Math.min(text.length / 500, 1); // Normalize to 0-1
  const randomFactor = Math.random() * 10; // Random score between 0-10
  
  return randomFactor * textComplexity;
}

/**
 * Detects suspicious text patterns that might indicate forgery
 * @param text The document text
 * @returns A score indicating suspicious patterns
 */
function detectSuspiciousTextPatterns(text: string): number {
  let score = 0;
  
  // Check for misaligned text (simplified)
  if (/\s{5,}/.test(text)) {
    score += 5;
  }
  
  // Check for unusual character combinations
  if (/[A-Z]{10,}/.test(text)) {
    score += 3;
  }
  
  // Check for inconsistent spacing
  const spacingPattern = text.match(/\s+/g);
  if (spacingPattern && new Set(spacingPattern.map(s => s.length)).size > 3) {
    score += 5;
  }
  
  // Check for unusual symbols that might indicate copy-paste
  if (/[§¶†‡]/.test(text)) {
    score += 2;
  }
  
  return Math.min(score, 25); // Cap at maximum score
}

/**
 * Simulates checking for digital manipulation indicators
 * In a real implementation, this would analyze image artifacts, compression inconsistencies, etc.
 * @returns A score indicating potential digital manipulation
 */
function simulateDigitalManipulationCheck(): number {
  // This is a simplified simulation
  // In a real implementation, this would analyze image artifacts, compression patterns, etc.
  
  // For demo purposes, we'll return a random score
  return Math.random() * 15; // Random score between 0-15
}
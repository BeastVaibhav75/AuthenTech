'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { useRouter } from 'next/navigation';
import { detectForgery } from '@/utils/forgery-detection';
import { generateDocumentHash, verifyDocument } from '@/utils/blockchain';

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [qrCode, setQrCode] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [forgeryAnalysis, setForgeryAnalysis] = useState<{
    isForged: boolean;
    confidence: number;
    details: string[];
  } | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCode(e.target.value);
  };

  const verifyDocument = async () => {
    if (!file && !qrCode) {
      setVerificationStatus('error');
      setVerificationMessage('Please upload a document or enter a QR code value');
      return;
    }

    setVerificationStatus('loading');
    setVerificationMessage('Verifying document...');
    setForgeryAnalysis(null);

    try {
      // Perform forgery detection if file is provided
      let documentHash = '';
      
      if (file) {
        // Run forgery detection and hash generation in parallel
        const [analysis, hash] = await Promise.all([
          detectForgery(file),
          generateDocumentHash(file)
        ]);
        
        setForgeryAnalysis(analysis);
        documentHash = hash;
      } else if (qrCode) {
        // Try to extract hash from QR code
        try {
          const qrData = JSON.parse(qrCode);
          if (qrData.hash) {
            documentHash = qrData.hash;
          }
        } catch (e) {
          // If QR code is not JSON, use it directly as hash
          documentHash = qrCode;
        }
      }

      if (!documentHash) {
        throw new Error('Could not generate or extract document hash');
      }

      // Verify document on blockchain
      const result = await verifyDocument(documentHash);
      
      if (result.isVerified) {
        setVerificationStatus('success');
        setVerificationMessage(
          `Document verified successfully! Document hash: ${documentHash.substring(0, 10)}...${documentHash.substring(documentHash.length - 10)}`
        );
      } else {
        setVerificationStatus('error');
        setVerificationMessage('Document verification failed. This document may not be authentic.');
      }
    } catch (error) {
      setVerificationStatus('error');
      setVerificationMessage('Verification failed. Please try again.');
      console.error('Verification error:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Verify Document Authenticity</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Upload a document or enter a QR code value to verify its authenticity using our blockchain-based verification system.
                </p>
              </div>
              <div className="w-full max-w-md space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="file" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Upload Document
                    </label>
                    <input
                      id="file"
                      type="file"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="qrCode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Enter QR Code Value
                    </label>
                    <input
                      id="qrCode"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter the QR code value"
                      value={qrCode}
                      onChange={handleQrCodeChange}
                    />
                  </div>
                  <button
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    onClick={verifyDocument}
                    disabled={verificationStatus === 'loading'}
                  >
                    {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Document'}
                  </button>
                </div>
                {verificationStatus !== 'idle' && (
                  <div
                    className={`p-4 rounded-md ${verificationStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : verificationStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
                  >
                    <p>{verificationMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
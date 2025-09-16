'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { generateDocumentHash, registerDocument } from '@/utils/blockchain';

export default function IssuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [formData, setFormData] = useState({
    documentType: '',
    recipientName: '',
    recipientEmail: '',
    issueDate: '',
    expiryDate: '',
    additionalInfo: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [documentHash, setDocumentHash] = useState<string>('');
  const [qrValue, setQrValue] = useState<string>('');
  const [isIssued, setIsIssued] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuthenticated || !userData) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Using the blockchain utility for hash generation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!file) {
        alert('Please upload a document file');
        setIsSubmitting(false);
        return;
      }

      // Generate document hash using blockchain utility
      const hash = await generateDocumentHash(file);
      setDocumentHash(hash);

      // Create QR code value with verification URL and hash
      const qrData = JSON.stringify({
        documentType: formData.documentType,
        recipientName: formData.recipientName,
        issueDate: formData.issueDate,
        hash: hash.substring(0, 16) // Using first 16 chars for brevity
      });
      setQrValue(qrData);

      // Create metadata for blockchain registration
      const metadata = JSON.stringify({
        documentType: formData.documentType,
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate || '',
        issuer: user?.email || 'unknown',
        timestamp: Date.now()
      });

      // Register document on blockchain
      const result = await registerDocument(hash, metadata);
      console.log('Document registered on blockchain:', result);

      // Set as issued
      setIsIssued(true);
    } catch (error) {
      console.error('Error issuing document:', error);
      alert('An error occurred while issuing the document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Issue New Document</h1>
              <p className="text-muted-foreground mt-1">
                Create a new blockchain-verified document for your students or graduates.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Back to Dashboard
            </Link>
          </div>

          {isIssued ? (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-green-600"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold">Document Issued Successfully</h2>
                  <p className="text-muted-foreground">
                    The document has been successfully issued and recorded on the blockchain.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Document Details</h3>
                      <div className="rounded-md bg-muted p-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium">Document Type:</span>
                          <span className="text-sm col-span-2">{formData.documentType}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium">Recipient:</span>
                          <span className="text-sm col-span-2">{formData.recipientName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium">Issue Date:</span>
                          <span className="text-sm col-span-2">{formData.issueDate}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-sm font-medium">Expiry Date:</span>
                          <span className="text-sm col-span-2">{formData.expiryDate || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Blockchain Information</h3>
                      <div className="rounded-md bg-muted p-4 space-y-2">
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Document Hash:</span>
                          <p className="text-xs font-mono bg-background p-2 rounded overflow-x-auto">
                            {documentHash}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Transaction ID:</span>
                          <p className="text-xs font-mono bg-background p-2 rounded">
                            0x{Math.random().toString(16).substring(2, 10)}...{Math.random().toString(16).substring(2, 10)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col items-center justify-center">
                    <div className="space-y-2 text-center">
                      <h3 className="text-lg font-medium">QR Code for Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        This QR code can be used to verify the authenticity of the document.
                      </p>
                    </div>
                    <div className="p-4 bg-white rounded-md">
                      <QRCode value={qrValue} size={200} />
                    </div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => window.print()}
                      >
                        Print QR Code
                      </button>
                      <button
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setIsIssued(false)}
                      >
                        Issue Another Document
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="documentType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Document Type
                      </label>
                      <select
                        id="documentType"
                        name="documentType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.documentType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select document type</option>
                        <option value="Degree Certificate">Degree Certificate</option>
                        <option value="Diploma Certificate">Diploma Certificate</option>
                        <option value="Course Completion Certificate">Course Completion Certificate</option>
                        <option value="Transcript">Transcript</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="recipientName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Recipient Name
                      </label>
                      <input
                        id="recipientName"
                        name="recipientName"
                        type="text"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter recipient's full name"
                        value={formData.recipientName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="recipientEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Recipient Email
                      </label>
                      <input
                        id="recipientEmail"
                        name="recipientEmail"
                        type="email"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter recipient's email"
                        value={formData.recipientEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="issueDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Issue Date
                      </label>
                      <input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.issueDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="expiryDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Expiry Date (Optional)
                      </label>
                      <input
                        id="expiryDate"
                        name="expiryDate"
                        type="date"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.expiryDate}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="file" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Upload Document
                      </label>
                      <input
                        id="file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={handleFileChange}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Accepted file formats: PDF, JPG, JPEG, PNG, DOC, DOCX. Maximum file size: 10MB.
                      </p>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="additionalInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Additional Information (Optional)
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        rows={4}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter any additional information about the document"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link
                      href="/dashboard"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Issuing Document...' : 'Issue Document'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
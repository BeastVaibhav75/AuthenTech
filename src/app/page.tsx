import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Secure Document Verification with Blockchain Technology
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                    AuthenTech provides a secure platform for educational institutions to issue and verify certificates using blockchain technology and AI-based forgery detection.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                  <Link
                    href="/verify"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Verify Document
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Institute Login
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px] drop-shadow-2xl">
                  <Image
                    src="/certificate-illustration.svg"
                    alt="Certificate Illustration"
                    fill
                    className="object-contain animate-float"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform offers cutting-edge solutions for document verification and security
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3 lg:gap-16">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[hsl(var(--border))]/40">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
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
                    className="h-10 w-10 text-primary"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Blockchain Security</h3>
                  <p className="text-muted-foreground">
                    Documents are secured with blockchain technology ensuring tamper-proof verification and immutable record-keeping.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[hsl(var(--border))]/40">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
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
                    className="h-10 w-10 text-primary"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">QR Code Verification</h3>
                  <p className="text-muted-foreground">
                    Each document includes a unique QR code for quick and easy verification by employers and institutions.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[hsl(var(--border))]/40">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-2">
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
                    className="h-10 w-10 text-primary"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">AI Forgery Detection</h3>
                  <p className="text-muted-foreground">
                    Advanced AI algorithms detect document forgery attempts using OCR technology and pattern recognition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform simplifies the document verification process
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-8 md:grid-cols-3 relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 hidden md:block"></div>
              
              <div className="flex flex-col items-center space-y-4 text-center relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="space-y-3 bg-background p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]/40 h-full">
                  <h3 className="text-2xl font-bold">Institute Registration</h3>
                  <p className="text-muted-foreground">
                    Educational institutions register on the platform to issue secure documents with blockchain verification.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4 text-center relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="space-y-3 bg-background p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]/40 h-full">
                  <h3 className="text-2xl font-bold">Document Issuance</h3>
                  <p className="text-muted-foreground">
                    Institutions upload and issue certificates with blockchain-based hash and QR code for secure verification.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4 text-center relative z-10">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div className="space-y-3 bg-background p-6 rounded-xl shadow-lg border border-[hsl(var(--border))]/40 h-full">
                  <h3 className="text-2xl font-bold">Easy Verification</h3>
                  <p className="text-muted-foreground">
                    Anyone can verify document authenticity by scanning the QR code or uploading the document for instant validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-4xl mx-auto bg-background p-8 md:p-12 rounded-2xl shadow-xl border border-[hsl(var(--border))]/40">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Ready to Get Started?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-xl/relaxed xl:text-xl/relaxed">
                  Join the growing number of institutions using AuthenTech for secure document verification
                </p>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Register as Institution
                </Link>
                <Link
                  href="/verify"
                  className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-base font-medium shadow-lg transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Verify a Document
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

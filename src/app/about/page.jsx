'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Users, Shield, Zap, Target, Award, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-accent-light hover:text-accent-primary font-medium mb-6 transition text-sm animate-in"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Hero Section */}
        <section className="mb-16 sm:mb-24 mt-4 text-center animate-in delay-1">

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dark-text mb-6 tracking-tight">
            Redefining How You <br className="hidden sm:block" />
            <span className="gradient-text">Buy, Sell & Rent</span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-dark-text-secondary leading-relaxed">
            Homemakers is India's most advanced real estate management platform,
            designed to bring transparency, speed, and intelligence to every transaction.
          </p>
        </section>

        {/* Stats Section */}
        <section className="mb-16 sm:mb-24 animate-in delay-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            <StatCard value="10K+" label="Properties Listed" />
            <StatCard value="5K+" label="Happy Families" />
            <StatCard value="150+" label="Cities Covered" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-16 sm:mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in delay-3">
          <div className="glass-card rounded-3xl p-8 sm:p-10 hover-lift hover:border-accent-primary/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-dark-md mb-6">
              <Target size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-4">Our Mission</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              To empower individuals and businesses with seamless, data-driven real estate solutions.
              We believe that finding a home or an investment should be a joy, not a chore.
              By removing intermediaries and bringing everything onto a single transparent platform,
              we are making the real estate market accessible to everyone.
            </p>
          </div>
          <div className="glass-card rounded-3xl p-8 sm:p-10 hover-lift hover:border-accent-primary/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-secondary to-accent-primary flex items-center justify-center shadow-dark-md mb-6">
              <Zap size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-dark-text mb-4">Our Vision</h2>
            <p className="text-dark-text-secondary leading-relaxed">
              We envision a future where real estate transactions take minutes, not months.
              A unified digital ecosystem powered by AI, bridging the gap between buyers, sellers,
              and agents. We are building the foundational infrastructure for the next generation
              of smart cities and communities across India.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16 sm:mb-24 animate-in delay-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-text mb-4">Why Choose Homemakers</h2>
            <p className="text-dark-text-secondary">The pillars that make us different</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <ValueCard

              title="Trust & Security"
              description="Every property and agent on our platform undergoes rigorous verification to ensure you deal only with genuine parties."
            />
            <ValueCard

              title="Community First"
              description="We prioritize the needs of our users. From neighborhood insights to shared amenities, we build communities, not just houses."
            />
            <ValueCard

              title="Premium Experience"
              description="A seamless, ad-free, and beautifully designed interface that treats your property search with the respect it deserves."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="animate-in delay-5 relative overflow-hidden rounded-3xl glass-card border-accent-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-transparent" />
          <div className="relative p-10 sm:p-16 text-center">
            <h2 className="text-3xl font-bold text-dark-text mb-4">Ready to find your dream home?</h2>
            <p className="text-dark-text-secondary mb-8 max-w-xl mx-auto">
              Join thousands of others who have discovered the smarter way to navigate real estate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search/results"
                className="px-8 py-3.5 bg-accent-primary hover:bg-accent-dark text-white font-bold rounded-xl transition shadow-dark-md hover:shadow-glow w-full sm:w-auto text-center"
              >
                Browse Properties
              </Link>
              <Link
                href="/sell"
                className="px-8 py-3.5 bg-dark-bg-tertiary hover:bg-dark-bg-hover text-dark-text font-bold rounded-xl transition border border-dark-border/60 w-full sm:w-auto text-center"
              >
                List a Property
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border/40 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <Building2 size={12} className="text-white" />
            </div>
            <span className="font-bold text-dark-text">HomeMakers</span>
          </div>
          <p className="text-sm text-dark-text-muted">© 2025 HomeMakers. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Privacy</a>
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Terms</a>
            <a href="#" className="text-sm text-dark-text-muted hover:text-accent-primary transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="p-6 bg-dark-bg-secondary rounded-2xl border border-dark-border/60 text-center hover:border-accent-primary/30 transition-colors">
      <div className="text-3xl sm:text-4xl font-black text-dark-text mb-2 tracking-tight">{value}</div>
      <div className="text-xs sm:text-sm font-medium text-dark-text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

function ValueCard({ title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-dark-bg-secondary rounded-2xl border border-dark-border/60 hover-lift hover:border-accent-primary/30 transition-all">

      <h3 className="text-xl font-bold text-dark-text mb-3">{title}</h3>
      <p className="text-dark-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}

function SparkleIcon(props) {
  return (
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
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

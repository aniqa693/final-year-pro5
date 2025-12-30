"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Sparkles, Zap, BarChart3, Shield, Users, Clock, TrendingUp, 
  Globe, CheckCircle, ChevronRight, Target, Brain, Palette, 
  Calendar, TrendingUp as TrendingIcon, ShieldCheck, Users as UsersIcon,
  MessageSquare, Rocket, Star, Heart, Cpu, Award, Cloud, Lock,
  Share2, Filter, RefreshCw, Bell, Settings, HelpCircle
} from "lucide-react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState([
    { value: 0, label: "Active Users", target: 10000 },
    { value: 0, label: "Posts Scheduled", target: 500000 },
    { value: 0, label: "Uptime", target: 99.9 },
    { value: 0, label: "User Rating", target: 4.8 }
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animate counters
    const intervals = stats.map((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(interval);
        }
        
        setStats(prev => prev.map((s, i) => 
          i === index ? { ...s, value: Math.round(current * 100) / 100 } : s
        ));
      }, duration / steps);
      
      return interval;
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      intervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      {/* Mouse follower gradient */}
      <div 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
        }}
      />
      
      {/* Animated floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-blue-400/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${0.5 + Math.random() * 1.5})`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl z-50 border-b border-blue-100/50 shadow-lg shadow-blue-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
                SocialAI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth" 
                className="relative text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg font-medium group"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-blue-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </Link>
              <Link 
                href="/auth" 
                className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 font-semibold group overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 to-blue-800 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                <span className="relative flex items-center gap-2">
                  Get Started Free
                  <Rocket className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full px-4 py-2 mb-8 shadow-lg animate-fade-in-up">
              <div className="relative">
                <Zap className="h-4 w-4 text-blue-600 animate-bounce" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-medium text-blue-700">AI-Powered Platform</span>
              <span className="text-xs text-blue-500 ml-2 animate-pulse">✨ New Features Added</span>
            </div>
            
            <h1 className="text-xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              Transform Your
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent animate-gradient-x">
                  Social Media Strategy
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Streamline your social media workflow with artificial intelligence. Create, schedule, analyze, 
              and optimize content across all platforms from one intelligent dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
              <Link 
                href="/auth" 
                className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 text-lg font-semibold overflow-hidden animate-pulse-slow"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-300 group-hover:animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2">
                  Start Free Trial 
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>
              
              <button className="group border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 text-lg font-semibold animate-fade-in-up delay-300">
                <span className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  Watch Demo
                </span>
              </button>
            </div>
            
            {/* Animated Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-100/50 border border-blue-50 hover:border-blue-200 hover:scale-105 transition-all duration-300 group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl font-bold text-blue-700 mb-2 animate-count">
                    {stat.label === "User Rating" ? stat.value.toFixed(1) : stat.value.toLocaleString()}
                    {stat.label === "Uptime" && "%"}
                    {stat.label === "User Rating" && "/5"}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  <div className="mt-2 h-1 w-12 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full group-hover:w-24 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-blue-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent animate-gradient-x">
                  One Platform
                </span>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a content creator, manager, analyst, or client, we have the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                onMouseEnter={() => setActiveFeature(index)}
                className={`group relative bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl border-2 transition-all duration-500 hover:-translate-y-3 ${
                  activeFeature === index 
                    ? 'border-blue-400 shadow-2xl shadow-blue-100/50' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-2 transition-transform" />
                </div>
                
                {/* Hover effect particles */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See It in
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Action
              </span>
            </h2>
          </div>
          
          <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl border-2 border-blue-100 p-8 shadow-2xl shadow-blue-100/30 overflow-hidden">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Interactive Dashboard Preview
                </h3>
                
                <div className="space-y-6">
                  {dashboardFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                {/* Mock dashboard with animations */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-white text-sm font-mono">Dashboard v2.0</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-lg p-4 animate-pulse-slow">
                      <div className="h-2 bg-gray-700 rounded w-3/4 mb-3"></div>
                      <div className="h-2 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-700 rounded w-5/6"></div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="h-2 bg-gray-700 rounded w-1/2 mb-3"></div>
                      <div className="h-2 bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-700 rounded w-4/5"></div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-blue-400 animate-pulse" />
                      <div className="text-blue-300 text-sm font-medium">AI Generating Content...</div>
                    </div>
                    <div className="mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 animate-progress"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl animate-float">
                  <Rocket className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl animate-float" style={{animationDelay: '1s'}}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by
              <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="relative bg-gradient-to-b from-white to-gray-50 p-8 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ★★★★★
                </div>
                
                <div className="flex items-center gap-4 mb-6 mt-2">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {testimonial.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 italic relative">
                  <span className="absolute -top-3 -left-3 text-3xl text-blue-200">"</span>
                  {testimonial.quote}
                  <span className="absolute -bottom-3 -right-3 text-3xl text-blue-200">"</span>
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>2 months ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 animate-gradient-x"></div>
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-transparent"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-300 animate-orb"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 animate-orb" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl shadow-white/10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Ready to Transform Your Social Media?
            </h2>
            
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
              Join thousands of businesses and creators using our AI-powered platform. 
              Start your free trial today — no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
              <Link 
                href="/auth" 
                className="group relative bg-white text-blue-600 px-12 py-4 rounded-xl hover:shadow-2xl hover:shadow-white/40 transition-all duration-300 text-lg font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white translate-x-[-100%] group-hover:translate-x-100 transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-3">
                  Start Free 14-Day Trial
                  <Rocket className="h-5 w-5 group-hover:animate-bounce" />
                </span>
              </Link>
              
              <div className="text-blue-200 text-sm mt-4 sm:mt-0 animate-pulse">
                ⚡ No credit card required • Cancel anytime • 24/7 support
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up delay-300">
              {perks.map((perk, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 text-white p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
                >
                  <CheckCircle className="h-5 w-5 text-green-300 animate-pulse" />
                  <span className="text-sm font-medium">{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
        {/* Animated particles in footer */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/30 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 group">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  SocialAI
                </h3>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-powered social media management for modern businesses and creators. 
                Transform your social presence with intelligent automation.
              </p>
            </div>
            
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg mb-6 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-2 block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left">
              &copy; 2024 SocialAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    title: "Admin Dashboard",
    description: "Complete platform control, user management, and system configuration with advanced analytics."
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    title: "Manager Tools",
    description: "Team management, campaign oversight, approval workflows, and performance tracking."
  },
  {
    icon: <Palette className="h-8 w-8 text-white" />,
    title: "Creator Studio",
    description: "AI-powered content creation, smart scheduling, and real-time performance tracking."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-white" />,
    title: "Analytics Suite",
    description: "Deep insights, automated reporting, and data-driven recommendations across all platforms."
  }
];

const dashboardFeatures = [
  {
    icon: <Brain className="h-5 w-5" />,
    title: "AI Content Generation",
    description: "Generate engaging posts, captions, and hashtags with our advanced AI models"
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Smart Scheduling",
    description: "Schedule posts for optimal engagement times automatically"
  },
  {
    icon: <TrendingIcon className="h-5 w-5" />,
    title: "Real-time Analytics",
    description: "Track performance with live updates and actionable insights"
  },
  {
    icon: <Share2 className="h-5 w-5" />,
    title: "Multi-platform Sync",
    description: "Manage all your social accounts from one unified dashboard"
  }
];

const testimonials = [
  {
    initials: "SM",
    name: "Sarah Miller",
    role: "Marketing Director at TechCorp",
    quote: "SocialAI transformed our social media strategy. Our engagement increased by 40% in just 2 months!"
  },
  {
    initials: "JR",
    name: "James Rodriguez",
    role: "Content Creator",
    quote: "The AI content suggestions are incredible. I've cut my content creation time in half!"
  },
  {
    initials: "ET",
    name: "Emma Thompson",
    role: "Social Media Manager",
    quote: "The analytics dashboard is a game-changer. I can now prove ROI to our clients with real data."
  }
];

const perks = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
  "24/7 support"
];

const footerSections = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Changelog", "Roadmap"]
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press", "Partners"]
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Status", "Documentation", "Community"]
  }
];
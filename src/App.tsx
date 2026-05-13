import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  FileText, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Sparkles,
  ClipboardCopy,
  Layers,
  BookOpen,
  Settings,
  Smartphone,
  Tablet,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

type Template = 'ui-redesign' | 'tech-doc' | 'platform-migration';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function App() {
  const [input, setInput] = useState('');
  const [template, setTemplate] = useState<Template>('ui-redesign');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [architectedPrompt, setArchitectedPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!input) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const systemInstructions = {
        'ui-redesign': 'You are a Senior UI/UX Designer specialized in Shopify Polaris. Your task is to take a raw design request and "architect" it into a highly effective prompt for an AI designer like Claude. Focus on component hierarchy, design tokens, and user flow.',
        'tech-doc': 'You are a Senior Technical Illustrator. Your task is to take a raw technical documentation request and "architect" it into a highly effective prompt for an AI designer like Claude. Focus on stylistic consistency, technical accuracy, and cross-referencing.',
        'platform-migration': 'You are a Senior UI/UX Designer & Shopify POS Specialist. Your task is to take a raw platform migration request (e.g., mobile to tablet) and "architect" it into a highly effective prompt for an AI designer like Claude. Focus on responsive mapping, multi-pane layouts, and platform-specific UI extension constraints.'
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Architect the following raw request into a structured, professional prompt for a UI/UX designer AI (like Claude). 
        
        Raw Request: "${input}"
        
        The architected prompt should include:
        1. ROLE: A clear persona for the AI.
        2. CONTEXT: Background on the project and design system (e.g., Shopify Polaris).
        3. SOURCE MATERIAL: Breakdown of provided links, images, or files.
        4. TARGET: Specific platform and orientation details.
        5. REQUIREMENTS: Detailed list of components and behaviors.
        6. CONSTRAINTS: Technical or design system limitations.`,
        config: {
          systemInstruction: systemInstructions[template],
          temperature: 0.7,
        },
      });

      setArchitectedPrompt(response.text || '');
      setShowResult(true);
    } catch (err) {
      console.error('Gemini Error:', err);
      setError('Failed to architect prompt. Please check your API key or try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#202223] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#E1E3E5] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#008060] p-2 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="font-semibold text-lg tracking-tight">Prompt Architect</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#F1F2F3] p-1 rounded-lg border border-[#E1E3E5]">
            <button 
              onClick={() => { setTemplate('ui-redesign'); setShowResult(false); }}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${template === 'ui-redesign' ? 'bg-white shadow-sm text-[#008060]' : 'text-[#6D7175]'}`}
            >
              Redesign
            </button>
            <button 
              onClick={() => { setTemplate('tech-doc'); setShowResult(false); }}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${template === 'tech-doc' ? 'bg-white shadow-sm text-[#008060]' : 'text-[#6D7175]'}`}
            >
              Tech Doc
            </button>
            <button 
              onClick={() => { setTemplate('platform-migration'); setShowResult(false); }}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wider ${template === 'platform-migration' ? 'bg-white shadow-sm text-[#008060]' : 'text-[#6D7175]'}`}
            >
              Migration
            </button>
          </div>
          <div className="h-6 w-px bg-[#E1E3E5]" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#6D7175] uppercase tracking-widest">
            <Layers className="w-4 h-4" />
            v3.0
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Input Section */}
          <section className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E1E3E5] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#5C5F62]" />
                  {template === 'platform-migration' ? 'Migration Requirements' : 'Design Requirements'}
                </label>
                <span className="text-[10px] font-bold text-[#6D7175] bg-[#F1F2F3] px-2 py-1 rounded">INPUT</span>
              </div>
              <textarea 
                className="w-full h-80 p-4 bg-[#F9FAFB] border border-[#D2D5D8] rounded-lg focus:ring-2 focus:ring-[#008060] focus:border-transparent transition-all resize-none text-sm leading-relaxed font-mono"
                placeholder={
                  template === 'platform-migration' 
                  ? "Paste your migration requirements (e.g., Figma links, documentation)..." 
                  : "Paste your design requirements paragraph here..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              <button 
                onClick={handleProcess}
                disabled={!input || isProcessing}
                className={`mt-6 w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                  !input || isProcessing 
                  ? 'bg-[#F1F2F3] text-[#8C9196] cursor-not-allowed' 
                  : 'bg-[#008060] text-white hover:bg-[#006E52] active:scale-[0.98] shadow-md'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Architect Prompt
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Output Section */}
          <section>
            <AnimatePresence mode="wait">
              {!showResult ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full border-2 border-dashed border-[#D2D5D8] rounded-xl flex flex-col items-center justify-center p-12 text-center bg-white/50"
                >
                  <div className="bg-[#F1F2F3] p-6 rounded-full mb-4">
                    <BookOpen className="w-10 h-10 text-[#8C9196]" />
                  </div>
                  <h3 className="font-medium text-[#5C5F62]">Awaiting Requirements</h3>
                  <p className="text-sm text-[#8C9196] mt-2 max-w-xs">Select a template and paste your requirements to begin.</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Visual Breakdown Preview */}
                  <div className="bg-white rounded-xl border border-[#E1E3E5] overflow-hidden shadow-lg">
                    <div className="bg-[#202223] px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#8C9196]">
                        {template === 'platform-migration' ? 'Responsive Mapping' : 'Context Mapping'}
                      </span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                        <div className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                        <div className="w-2 h-2 rounded-full bg-[#27C93F]" />
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      {template === 'platform-migration' ? (
                        <>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 p-4 bg-[#F4F6F8] rounded-lg border border-[#E1E3E5] text-center">
                              <Smartphone className="w-5 h-5 mx-auto mb-2 text-[#6D7175]" />
                              <div className="text-[10px] font-bold text-[#6D7175]">MOBILE</div>
                              <div className="text-xs font-bold">FIGMA SOURCE</div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#D2D5D8]" />
                            <div className="flex-1 p-4 bg-[#E7F1EE] rounded-lg border border-[#B7D1C9] text-center">
                              <Tablet className="w-5 h-5 mx-auto mb-2 text-[#008060]" />
                              <div className="text-[10px] font-bold text-[#008060]">IPAD</div>
                              <div className="text-xs font-bold">LANDSCAPE</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-[10px] font-bold text-[#6D7175] uppercase tracking-widest">Documentation Sources</div>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="p-3 bg-[#F9FAFB] border border-[#E1E3E5] rounded-lg flex items-center justify-between">
                                <span className="text-xs font-medium">Shopify POS Build Docs</span>
                                <ExternalLink className="w-3 h-3 text-[#008060]" />
                              </div>
                              <div className="p-3 bg-[#F9FAFB] border border-[#E1E3E5] rounded-lg flex items-center justify-between">
                                <span className="text-xs font-medium">Cart Details API</span>
                                <ExternalLink className="w-3 h-3 text-[#008060]" />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-12 text-[#8C9196]">
                          <Layout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="text-sm italic">Visual breakdown generated for {template}...</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Copyable Prompt */}
                  <div className="bg-[#202223] rounded-xl p-6 text-[#E1E3E5] relative group shadow-xl">
                    <button 
                      onClick={() => navigator.clipboard.writeText(architectedPrompt)}
                      className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ClipboardCopy className="w-4 h-4 text-[#8C9196]" />
                    </button>
                    <h4 className="text-xs font-bold text-[#8C9196] mb-4 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Optimized Claude Prompt
                    </h4>
                    <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono text-[#AEE9D1]">
                      {architectedPrompt}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
    </div>
  );
}

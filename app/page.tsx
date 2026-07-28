"use client";
import { useState, useEffect } from "react";
import { Brain, Send, Save, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase को कनेक्ट करना
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  // नोट को डेटाबेस में सेव करने का फंक्शन
  const saveNote = async () => {
    if (!note) return alert("कुछ तो लिखो!");
    setLoading(true);
    const { error } = await supabase.from("notes").insert([{ content: note }]);
    setLoading(false);
    if (error) alert("Error saving note");
    else {
      alert("Note saved successfully!");
      setNote("");
    }
  };

  // AI से पूछने का फंक्शन
  const askAI = async () => {
    if (!note) return alert("AI से पूछने के लिए कुछ लिखें!");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: note }),
    });
    const data = await res.json();
    setAiResponse(data.text);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Brain className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">My AI Second Brain</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Note Input */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">Write Something...</h2>
            <textarea
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-600"
              placeholder="आज आपने क्या सीखा? यहाँ लिखें..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button 
                onClick={saveNote}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                Save to Brain
              </button>
              <button 
                onClick={askAI}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                Ask AI
              </button>
            </div>
          </div>

          {/* Right Side: AI Response */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 min-h-[300px]">
            <h2 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
              <Brain size={20} /> AI Insights
            </h2>
            <div className="text-slate-700 leading-relaxed italic">
              {aiResponse || "आपका AI यहाँ जवाब देगा। पहले कुछ लिखकर 'Ask AI' पर क्लिक करें!"}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, ArrowRight } from "lucide-react";

interface Message { role: "user" | "assistant"; content: string }

const knowledge = [
  { q: ["service", "what do you do", "offer"], a: "We plan, design and run social media campaigns across Instagram, Facebook, YouTube and more. We handle content, ads, analytics and growth." },
  { q: ["property", "real estate"], a: "We specialize in campaigns for property sellers: lead-gen ads, virtual tours, and content that converts inquiries into site visits." },
  { q: ["price", "cost", "pricing"], a: "Pricing depends on scope. Most engagements start at monthly retainers with clear KPIs. Share your goals on the Booking page for a tailored quote." },
  { q: ["portfolio", "work", "case study"], a: "Explore our recent images and a showreel on the Portfolio page." },
  { q: ["book", "meeting", "contact", "reservation"], a: "You can book a slot on our Booking page. We'll confirm within 24 hours." },
];

function replyTo(input: string) {
  const text = input.toLowerCase();
  const hit = knowledge.find(k => k.q.some(keyword => text.includes(keyword)));
  if (hit) return hit.a;
  return "I can help with services, pricing, portfolio and booking. For complex queries, please share details on the Booking page and a strategist will respond quickly.";
}

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm AdWhey Assistant. Ask me about services, pricing, or book a call." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const suggestions = useMemo(() => [
    "What services do you offer?",
    "Do you work with property sellers?",
    "Show me your portfolio",
    "How do I book?",
  ], []);

  function send(text?: string) {
    const content = (text ?? msg).trim();
    if (!content) return;
    setMsg("");
    setMessages((m) => [...m, { role: "user", content }, { role: "assistant", content: replyTo(content) }]);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <Card className="mb-4 w-[92vw] max-w-sm animate-enter p-4 md:max-w-md border shadow-elegant rounded-2xl backdrop-blur-xl bg-white/95 dark:bg-gray-950/90 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-blue-900/20 ring-1 ring-white/40 dark:ring-white/10">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-blue transition-all duration-300">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground">AdWhey Assistant</p>
                <p className="text-xs text-muted-foreground">AI-powered support</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted hover:scale-110 transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Messages */}
          <div ref={listRef} className="mb-4 max-h-64 space-y-3 overflow-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={cn(
                "rounded-xl px-4 py-3 text-sm max-w-[85%] shadow-sm transition-all duration-300",
                m.role === "user" 
                  ? "bg-gradient-primary text-white ml-auto text-right hover:shadow-glow" 
                  : "bg-white/90 dark:bg-gray-900/80 text-foreground mr-auto text-left border border-white/40 dark:border-white/10"
              )}>
                {m.content}
              </div>
            ))}
          </div>
          
          {/* Interactive Suggestions */}
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Button 
                key={s} 
                variant="outline" 
                size="sm" 
                onClick={() => send(s)} 
                className="text-xs border-gradient hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all duration-300 hover:scale-105 group"
              >
                {s}
                <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            ))}
          </div>
          
          {/* Input */}
          <div className="flex items-center gap-2">
            <Input 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)} 
              onKeyDown={(e) => e.key === "Enter" && send()} 
              placeholder="Type your question..." 
              aria-label="Chat input"
              className="text-foreground placeholder:text-muted-foreground bg-white/95 dark:bg-gray-900/85 border border-white/60 dark:border-white/10 focus:ring-2 focus:ring-purple-300"
            />
            <Button 
              onClick={() => send()} 
              variant="default"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-105 group"
            >
              <Send className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </div>
          
          {/* Footer */}
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Need a human?{" "}
            <Link to="/booking" className="story-link font-medium group">
              Book a call
              <ArrowRight className="w-3 h-3 inline ml-1 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </p>
        </Card>
      )}
      
      {/* Interactive Chat Toggle Button */}
      <Button 
        variant="default" 
        size="lg" 
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-110 rounded-full w-16 h-16 shadow-elegant group"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        )}
      </Button>
    </div>
  );
};

export default ChatWidget;

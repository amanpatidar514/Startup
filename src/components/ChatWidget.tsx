import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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
    { role: "assistant", content: "Hi! I’m AdWhey Assistant. Ask me about services, pricing, or book a call." },
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
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <Card className="mb-3 w-[92vw] max-w-sm animate-enter p-3 md:max-w-md bg-card border shadow-elegant">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">AdWhey Assistant</p>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
          </div>
          <div ref={listRef} className="mb-3 max-h-64 space-y-2 overflow-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={cn("rounded-md px-3 py-2 text-sm border", m.role === "user" ? "bg-secondary" : "bg-accent")}>{m.content}</div>
            ))}
          </div>
          <div className="mb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <Button key={s} variant="secondary" size="sm" onClick={() => send(s)}>{s}</Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Input value={msg} onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your question..." aria-label="Chat input" />
            <Button onClick={() => send()} variant="hero">Send</Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Need a human? <Link to="/booking" className="story-link">Book a call</Link>.
          </p>
        </Card>
      )}
      <Button variant="hero" size="lg" className="shadow-glow" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide Chat" : "Chat with AI"}
      </Button>
    </div>
  );
};

export default ChatWidget;

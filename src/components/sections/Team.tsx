import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import t1 from "@/assets/team-1.jpg";
import t2 from "@/assets/team-2.jpg";
import t3 from "@/assets/team-3.jpg";
import t4 from "@/assets/team-4.jpg";
import t5 from "@/assets/team-5.jpg";

const people = [
  { name: "Aryan Patel", role: "Creative Director", photo: t1 },
  { name: "Neha Sharma", role: "Performance Marketer", photo: t2 },
  { name: "Rahul Mehta", role: "Content Strategist", photo: t3 },
  { name: "Priya Desai", role: "Social Media Manager", photo: t4 },
  { name: "Karan Verma", role: "Video Producer", photo: t5 },
];

const Team = () => {
  return (
    <section className="container py-16 md:py-24" id="team">
      <header className="mb-8 text-center">
        <h2 className="text-3xl font-bold">Meet the Team</h2>
        <p className="text-muted-foreground">Five specialists. One unified strategy.</p>
      </header>
      <Separator className="mb-8" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {people.map((p) => (
          <Card key={p.name} className="group flex flex-col items-center gap-4 p-6 text-center transition-transform hover:translate-y-[-2px] hover:shadow-elegant">
            <img
              src={p.photo}
              alt={`${p.name} - ${p.role} at AdWhey`}
              loading="lazy"
              className="size-28 rounded-full object-cover shadow-elegant transition-transform group-hover:scale-105"
            />
            <div>
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Team;

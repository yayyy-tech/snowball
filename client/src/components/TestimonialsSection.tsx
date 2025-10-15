import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

//todo: remove mock functionality
const testimonials = [
  {
    name: "Rajesh Kumar",
    age: 32,
    role: "Software Engineer",
    quote: "Snowball helped me plan my retirement with clarity. The SIP step-up feature is brilliant!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    age: 28,
    role: "Marketing Manager",
    quote: "Finally, a retirement planner that understands Indian tax laws. Highly recommended!",
    rating: 5,
  },
  {
    name: "Amit Patel",
    age: 35,
    role: "Business Owner",
    quote: "The mutual fund recommendations are spot-on. I feel confident about my retirement now.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users planning their retirement
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.slice(currentIndex, currentIndex + 2).map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 space-y-4 card-hover border-2 shadow-xl"
                data-testid={`testimonial-${index}`}
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-chart-4 text-chart-4" />
                  ))}
                </div>
                <p className="text-muted-foreground italic text-lg">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.age} years</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`testimonial-dot-${index}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";

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
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const headingVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < 2; i++) {
      const index = (currentIndex + i) % testimonials.length;
      result.push({ ...testimonials[index], displayIndex: index });
    }
    return result;
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="container mx-auto px-4 md:px-8 relative z-10" ref={ref}>
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-balance">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied users planning their retirement
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${testimonial.displayIndex}-${currentIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1] 
                }}
              >
                <Card 
                  className="p-6 space-y-4 card-premium border-border/50 quote-card h-full"
                  data-testid={`testimonial-${index}`}
                >
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-chart-4 text-chart-4" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
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
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => setCurrentIndex(index)}
                data-testid={`testimonial-dot-${index}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

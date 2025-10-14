import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Target, Heart, Users, Shield } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-20 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
                <p className="text-xl text-muted-foreground">
                  Building financial freedom, one snowball at a time.
                </p>
              </div>

              <div className="space-y-6 text-base leading-relaxed">
                <p className="text-foreground/90">
                  At Snowball, we believe that wealth isn't built overnight - it's built quietly, consistently, and patiently over years of smart decisions. Our mission is to make that journey simple, visual, and deeply personal for every Indian.
                </p>
                
                <p className="text-foreground/90">
                  Most people start earning before they start understanding money. They get caught in the loop - spending, saving, and investing without clarity on what it truly leads to. That's where Snowball comes in.
                </p>
                
                <p className="text-foreground/90">
                  We're not another financial app. We're your financial clarity partner - helping you see how every decision today compounds into the future you deserve.
                </p>
              </div>

              <div className="bg-muted/30 rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Philosophy: Clarity Over Complexity
                </h2>
                <p className="text-foreground/90">
                  Money shouldn't feel intimidating. Snowball breaks down financial planning into something anyone can understand - a roadmap that shows you exactly how your savings, investments, and lifestyle choices stack up over time.
                </p>
                <div className="space-y-3">
                  <p className="font-medium">We focus on what truly matters:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Building long-term habits instead of chasing trends.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Simplifying decisions through data and psychology.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Helping you stay consistent - because consistency is the real compounding force.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  Why "Snowball"?
                </h2>
                <p className="text-foreground/90">
                  Because that's how wealth grows - slowly at first, then all at once. A snowball gathers momentum as it rolls down a hill, just like your money when guided with discipline and direction.
                </p>
                <p className="text-foreground/90">
                  Our name reflects our belief that anyone, regardless of where they start, can build something powerful with patience and planning.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Our Vision
                </h2>
                <p className="text-foreground/90">
                  To help every young professional in India take control of their money, retire with dignity, and live without financial stress. We want to make long-term wealth planning as natural as checking your fitness progress - something you look forward to, not avoid.
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  The Team Behind Snowball
                </h2>
                <p className="text-foreground/90">
                  We're a group of finance enthusiasts, behavioral researchers, and builders who've seen firsthand how people struggle with financial planning. We've spent years studying how people feel about money - and built Snowball to bridge that gap between logic and emotion.
                </p>
                <p className="text-foreground/90 italic">
                  Because we know this truth: you don't need to be rich to start - you need to start to become rich.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Our Promise
                </h2>
                <p className="text-foreground/90">
                  We'll always keep your experience simple, your data secure, and your roadmap transparent. No jargon. No sales pitch. Just honest, actionable guidance that grows with you - year after year.
                </p>
                <p className="text-foreground/90">
                  Snowball isn't just about money. It's about helping you live a life where your finances support your dreams - not limit them.
                </p>
                <p className="text-lg font-medium text-primary">
                  Because the best time to start building your snowball was yesterday. The next best time is now.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

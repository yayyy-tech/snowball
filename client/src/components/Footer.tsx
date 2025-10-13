import { Snowflake } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Snowflake className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Snowball</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted retirement planning partner for a secure financial future.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features"><a className="text-muted-foreground hover:text-foreground transition-colors">Features</a></Link></li>
              <li><Link href="/#how-it-works"><a className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Disclaimer:</strong> This platform provides educational financial insights. We are not a SEBI-registered advisor. 
              Recommendations are for informational purposes only. Mutual fund and bond data sourced from public APIs. 
              Verify all instruments before investing.
            </p>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Snowball. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

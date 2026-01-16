import { useState } from "react";
import { ChevronDown, ChevronUp, PieChart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CollapsibleBreakdownProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  testId?: string;
}

export function CollapsibleBreakdown({
  title,
  icon,
  children,
  defaultExpanded = false,
  testId = "dropdown-breakdown"
}: CollapsibleBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
        data-testid={testId}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-full">
            {icon || <PieChart className="h-5 w-5 text-blue-400" />}
          </div>
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="text-gray-400 group-hover:text-white transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 bg-gray-800/50 dark:bg-gray-900/50 rounded-lg border border-gray-700/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
  score: number;
}

/**
 * ScoreDisplay component renders the player's current score during gameplay
 * Position: Fixed at top-right corner to avoid interfering with the game board
 */
export const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <Card className="fixed top-4 right-4 px-6 py-3 bg-white/95 backdrop-blur-sm shadow-lg z-50">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">Score:</span>
        <span className="text-2xl font-bold text-primary tabular-nums">
          {score}
        </span>
      </div>
    </Card>
  );
};

export default ScoreDisplay;

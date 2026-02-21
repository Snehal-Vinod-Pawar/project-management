import { FolderPlus, UserPlus, Users, ClipboardList, Clock, Star, Zap } from "lucide-react";

export default function OnboardingHero() {
  return (
    <div className="w-full mt-0 mb-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Welcome to your <span className="text-blue-600">Workspace</span>
        </h1>
        <p className="text-xl font-semibold text-gray-400 max-w-3xl mb-8">
          Let's get started by creating yourfirst project and inviting your team.
        </p>
      </div>

    </div>
  );
}

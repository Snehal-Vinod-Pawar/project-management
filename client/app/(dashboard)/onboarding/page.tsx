import OnboardingHero from "@/components/onboarding/OnboardingHero";
import ActionGrid from "@/components/onboarding/ActionGrid";
import WorkspacePreview from "@/components/onboarding/WorkspacePreview";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-10 py-0">
      <OnboardingHero />
      <ActionGrid />
      <WorkspacePreview/>
    </div>
  );
}

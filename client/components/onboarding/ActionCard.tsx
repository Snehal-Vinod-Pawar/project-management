type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export default function ActionCard({ title, description, icon,onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>

      <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">
        Get Started →
      </button>
    </div>
  );
}

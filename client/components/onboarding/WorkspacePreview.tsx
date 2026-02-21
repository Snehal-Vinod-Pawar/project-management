import { Zap, Shield, BarChart3, Clock, Users, Sparkles, CheckCircle2, TrendingUp, Award } from "lucide-react";

export default function OnboardingBottomSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Real-time collaboration with instant updates across your entire team",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption for your data",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Track progress and productivity with detailed insights and reports",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600"
    }
  ];

  const stats = [
    { 
      icon: <Clock className="w-5 h-5" />, 
      value: "2 min", 
      label: "Setup time",
      color: "text-blue-600"
    },
    { 
      icon: <Users className="w-5 h-5" />, 
      value: "10k+", 
      label: "Active teams",
      color: "text-purple-600"
    },
    { 
      icon: <Sparkles className="w-5 h-5" />, 
      value: "4.9/5", 
      label: "User rating",
      color: "text-amber-600"
    }
  ];

  const benefits = [
    { text: "Unlimited projects and boards", icon: <CheckCircle2 className="w-4 h-4" /> },
    { text: "Real-time notifications", icon: <CheckCircle2 className="w-4 h-4" /> },
    { text: "Custom workflows", icon: <CheckCircle2 className="w-4 h-4" /> },
    { text: "Team collaboration tools", icon: <CheckCircle2 className="w-4 h-4" /> },
    { text: "Advanced reporting", icon: <CheckCircle2 className="w-4 h-4" /> },
    { text: "Priority support", icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  const achievements = [
    { icon: <TrendingUp className="w-5 h-5" />, label: "30% faster project delivery" },
    { icon: <Award className="w-5 h-5" />, label: "Industry-leading platform" },
    { icon: <Users className="w-5 h-5" />, label: "Trusted by Fortune 500" }
  ];

  return (
    <div className="mt-8 space-y-8">

      {/* Features Section */}
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-8 border-2 border-gray-100 shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Everything you need to succeed</h2>
          <p className="text-gray-600">Powerful features to help your team work smarter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className={`relative w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center ${feature.iconColor} mx-auto mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 shadow-md group-hover:shadow-xl`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent rounded-2xl"></div>
                <div className="relative">{feature.icon}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="text-green-600 flex-shrink-0 transform hover:scale-125 transition-transform duration-200">{benefit.icon}</div>
                <span className="text-sm text-gray-700">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Join the most productive teams</h3>
            <p className="text-gray-300">Start building better projects today</p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="text-blue-400">{achievement.icon}</div>
                <span className="text-gray-200">{achievement.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Ready to boost your productivity?</h4>
              <p className="text-sm text-gray-600">Complete the steps above to unlock your full potential</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
}
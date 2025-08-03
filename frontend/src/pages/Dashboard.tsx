import { useNavigate } from 'react-router-dom';
import { useApiData } from '../hooks/useApi';
import { genCAPI, mentorAPI, accountAPI, genCFeedbackAPI } from '../api';
import { GenC, Mentor, Account, GenCFeedback } from '../types';
import { Users, UserCheck, Building2, MessageSquare, TrendingUp, Plus, DollarSign, Clock } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const { data: gencs, loading: gencsLoading } = useApiData<GenC>(() => genCAPI.getAll());
  const { data: mentors, loading: mentorsLoading } = useApiData<Mentor>(() => mentorAPI.getAll());
  const { data: accounts, loading: accountsLoading } = useApiData<Account>(() => accountAPI.getAll());
  const { data: feedbacks, loading: feedbacksLoading } = useApiData<GenCFeedback>(() => genCFeedbackAPI.getAll());

  // Calculate metrics
  const totalGenCs = gencs.length;
  const activeMentors = mentors.length;
  const totalAccounts = accounts.length;
  const billingStartedCount = gencs.filter(genc => genc.status === 'Billing Started').length;
  const billingPlannedCount = gencs.filter(genc => genc.status === 'Billing Planned').length;
  const idleGenCsCount = gencs.filter(genc => genc.status === 'Idle').length;

  // Status breakdown
  const statusBreakdown = gencs.reduce((acc, genc) => {
    acc[genc.status] = (acc[genc.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const isLoading = gencsLoading || mentorsLoading || accountsLoading || feedbacksLoading;

  const metrics = [
    {
      title: 'Total GenCs',
      value: totalGenCs,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'metric-icon-blue',
      description: 'Trainee employees'
    },
    {
      title: 'Billing Planned',
      value: billingPlannedCount,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'metric-icon-green',
      description: 'GenCs with billing planned'
    },
    {
      title: 'Idle GenCs',
      value: idleGenCsCount,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'metric-icon-purple',
      description: 'GenCs awaiting assignment'
    },
    {
      title: 'Billing Started',
      value: billingStartedCount,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'metric-icon-orange',
      description: 'GenCs in billing'
    }
  ];

  const quickActions = [
    {
      title: 'Add New GenC',
      description: 'Register a new trainee employee',
      icon: Users,
      onClick: () => navigate('/gencs'),
      color: 'bg-blue-100 hover:bg-blue-200'
    },
    {
      title: 'Add Mentor',
      description: 'Register a new mentor',
      icon: UserCheck,
      onClick: () => navigate('/mentors'),
      color: 'bg-green-100 hover:bg-green-200'
    },
    {
      title: 'Add Feedback',
      description: 'Submit feedback for a GenC',
      icon: MessageSquare,
      onClick: () => navigate('/feedbacks'),
      color: 'bg-purple-100 hover:bg-purple-200'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome to Cognizant GenC Tracking System</p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="metric-card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                  <div className="flex items-baseline">
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {isLoading ? (
                        <span className="loading-shimmer inline-block w-8 h-6 rounded"></span>
                      ) : (
                        metric.value
                      )}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">{metric.description}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="cognizant-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={action.onClick}
                    className={`w-full p-4 rounded-lg transition-all duration-200 ${action.color} group`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                      <div className="ml-3 text-left">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                      <Plus className="h-4 w-4 text-gray-400 ml-auto group-hover:text-gray-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="cognizant-card">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">GenC Status Overview</h2>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="loading-shimmer h-4 rounded"></div>
                ))}
              </div>
            ) : Object.keys(statusBreakdown).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(statusBreakdown).map(([status, count]) => {
                  const percentage = totalGenCs > 0 ? (count / totalGenCs) * 100 : 0;
                  const statusColors: Record<string, string> = {
                    'Idle': 'bg-gray-500',
                    'Under Project Training': 'bg-yellow-500',
                    'Customer Onboarded': 'bg-blue-500',
                    'Billing Planned': 'bg-purple-500',
                    'Billing Started': 'bg-green-500',
                    'GenC Regularized': 'bg-emerald-500',
                    'Feedback Not Good': 'bg-red-500',
                    'Released/Resigned': 'bg-gray-400'
                  };
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-400'} mr-3`}></div>
                        <span className="text-sm text-gray-700">{status}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No GenCs added yet</p>
                <button 
                  onClick={() => navigate('/gencs')}
                  className="mt-4 cognizant-button-primary"
                >
                  Add First GenC
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 cognizant-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button 
              onClick={() => navigate('/feedbacks')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full loading-shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="loading-shimmer h-4 rounded w-1/3"></div>
                    <div className="loading-shimmer h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : feedbacks.length > 0 ? (
            <div className="space-y-4">
              {feedbacks.slice(0, 3).map((feedback) => (
                <div key={feedback.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      New feedback for {feedback.genc?.genc_name || 'GenC'}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {feedback.mentor?.mentor_name || 'Mentor'} • {' '}
                      {feedback.date_of_feedback ? new Date(feedback.date_of_feedback).toLocaleDateString() : 'Recent'}
                    </p>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {feedback.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No recent feedback</p>
              <p className="text-gray-500 mb-4">Get started by adding feedback for GenCs.</p>
              <button 
                onClick={() => navigate('/feedbacks')}
                className="cognizant-button-primary"
              >
                Add Feedback
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
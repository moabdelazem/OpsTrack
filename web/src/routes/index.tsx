import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  BarChart,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

async function getDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch("/api/tasks/dashboard-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard stats");
  }
  return await response.json();
}

interface DashboardStatsProps {}

const DashboardStats: React.FC<DashboardStatsProps> = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState />;
  }

  const { total, completed, completedPercentage } = data.stats;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        TrackOps
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tasks"
          value={total}
          icon={<Circle className="w-8 h-8 text-blue-500" />}
        />
        <StatCard
          title="Completed Tasks"
          value={completed}
          icon={<CheckCircle className="w-8 h-8 text-green-500" />}
        />
        <StatCard
          title="Completion Rate"
          value={`${completedPercentage}%`}
          icon={<BarChart className="w-8 h-8 text-purple-500" />}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div
      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
      {icon}
    </motion.div>
  );
};

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <Loader className="w-12 h-12 animate-spin text-blue-500" />
    <span className="ml-2 text-lg text-gray-700 dark:text-gray-300">
      Loading stats...
    </span>
  </div>
);

const ErrorState: React.FC = () => (
  <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-lg">
    <div className="flex items-center">
      <AlertCircle className="w-6 h-6 mr-2" />
      <p>Error loading dashboard stats. Please try again later.</p>
    </div>
  </div>
);

export const Route = createFileRoute("/")({
  component: DashboardStats,
});

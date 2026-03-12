import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Layers, Target, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  goalsData,
  chartData,
  formatDate,
  getGoalTasks,
  getCompletedTasksCount,
  getProgressPercent,
  getBlockProgress,
  getOverallProgress,
} from '../data/dashboardData';

const getBlockDescription = (percent) => {
  if (percent === 0) return 'Этап еще не начат';
  if (percent === 100) return 'Все задачи блока выполнены';
  return 'Частичное выполнение задач';
};

export default function OverviewPage() {
  const [selectedYear, setSelectedYear] = useState('2026');

  const currentGoal = useMemo(() => {
    const inProgressGoal = goalsData
      .filter((goal) => goal.goal_status === 'В процессе')
      .sort((a, b) => new Date(a.goal_deadline) - new Date(b.goal_deadline))[0];

    if (inProgressGoal) return inProgressGoal;

    return goalsData
      .filter((goal) => goal.goal_status !== 'Выполнено')
      .sort((a, b) => new Date(a.goal_deadline) - new Date(b.goal_deadline))[0];
  }, []);

  const currentGoalTasks = useMemo(() => {
    return currentGoal ? getGoalTasks(currentGoal.goal_id) : [];
  }, [currentGoal]);

  const currentGoalCompletedTasks = useMemo(() => {
    return getCompletedTasksCount(currentGoalTasks);
  }, [currentGoalTasks]);

  const currentGoalProgress = useMemo(() => {
    return getProgressPercent(currentGoalTasks);
  }, [currentGoalTasks]);

  const currentTask = useMemo(() => {
    return currentGoalTasks.find((task) => task.task_status === 'В процессе')
      || currentGoalTasks.find((task) => task.task_status === 'Не начато')
      || currentGoalTasks[0]
      || null;
  }, [currentGoalTasks]);

  const geoProgress = useMemo(() => getBlockProgress('Геоаналитика'), []);
  const urbanProgress = useMemo(() => getBlockProgress('Градостроительство и экология'), []);
  const supportProgress = useMemo(() => getBlockProgress('Господдержка и размещение'), []);
  const institutionalProgress = useMemo(() => getBlockProgress('Институциональное сопровождение'), []);
  const govClientsProgress = useMemo(() => getBlockProgress('Работа с госзаказчиками'), []);
  const overallProgress = useMemo(() => getOverallProgress(), []);

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Основные показатели
        </h1>

        <div className="flex items-center mt-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Обновлено: 12.03.2026</span>
        </div>
      </div>

      {/* KPI BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-slate-700 leading-tight">
                Готовность GR-контура проекта
              </h3>
              <Info className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>

            <div className="mt-2 text-3xl font-bold text-slate-900">
              {overallProgress}%
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Сводный показатель по всем задачам проекта
            </p>
          </div>

          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-slate-700 h-1.5 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-teal-100 bg-teal-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-teal-800">Геоаналитика</h3>

            <div className="mt-2 text-3xl font-bold text-teal-700">
              {geoProgress}%
            </div>

            <p className="mt-1 text-xs text-teal-600/80">
              {getBlockDescription(geoProgress)}
            </p>
          </div>

          <div className="mt-4 w-full bg-teal-200/50 rounded-full h-1.5">
            <div
              className="bg-teal-500 h-1.5 rounded-full"
              style={{ width: `${geoProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 leading-tight">
              Градостроительство и экология
            </h3>

            <div className="mt-2 text-3xl font-bold text-slate-600">
              {urbanProgress}%
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {getBlockDescription(urbanProgress)}
            </p>
          </div>

          <div className="mt-4 w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-slate-400 h-1.5 rounded-full"
              style={{ width: `${urbanProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-amber-800 leading-tight">
              Господдержка и размещение
            </h3>

            <div className="mt-2 text-3xl font-bold text-amber-700">
              {supportProgress}%
            </div>

            <p className="mt-1 text-xs text-amber-600/80">
              {getBlockDescription(supportProgress)}
            </p>
          </div>

          <div className="mt-4 w-full bg-amber-200/50 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${supportProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-violet-100 bg-violet-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-violet-800 leading-tight">
              Институциональное сопровождение
            </h3>

            <div className="mt-2 text-3xl font-bold text-violet-700">
              {institutionalProgress}%
            </div>

            <p className="mt-1 text-xs text-violet-600/80">
              {getBlockDescription(institutionalProgress)}
            </p>
          </div>

          <div className="mt-4 w-full bg-violet-200/50 rounded-full h-1.5">
            <div
              className="bg-violet-500 h-1.5 rounded-full"
              style={{ width: `${institutionalProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-emerald-800 leading-tight">
              Работа с госзаказчиками
            </h3>

            <div className="mt-2 text-3xl font-bold text-emerald-700">
              {govClientsProgress}%
            </div>

            <p className="mt-1 text-xs text-emerald-600/80">
              {getBlockDescription(govClientsProgress)}
            </p>
          </div>

          <div className="mt-4 w-full bg-emerald-200/50 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${govClientsProgress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

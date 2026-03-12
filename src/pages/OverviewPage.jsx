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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Основные показатели</h1>
        <div className="flex items-center mt-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Обновлено: 12.03.2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium text-slate-700 leading-tight">Готовность GR-контура проекта</h3>
              <Info className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{overallProgress}%</div>
            <p className="mt-1 text-xs text-slate-500">Сводный показатель по всем задачам проекта</p>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-1.5">
            <div className="bg-slate-700 h-1.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-teal-100 bg-teal-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-teal-800">Геоаналитика</h3>
            <div className="mt-2 text-3xl font-bold text-teal-700">{geoProgress}%</div>
            <p className="mt-1 text-xs text-teal-600/80">{getBlockDescription(geoProgress)}</p>
          </div>
          <div className="mt-4 w-full bg-teal-200/50 rounded-full h-1.5">
            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${geoProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-700 leading-tight">Градостроительство и экология</h3>
            <div className="mt-2 text-3xl font-bold text-slate-600">{urbanProgress}%</div>
            <p className="mt-1 text-xs text-slate-500">{getBlockDescription(urbanProgress)}</p>
          </div>
          <div className="mt-4 w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${urbanProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-amber-800 leading-tight">Господдержка и размещение</h3>
            <div className="mt-2 text-3xl font-bold text-amber-700">{supportProgress}%</div>
            <p className="mt-1 text-xs text-amber-600/80">{getBlockDescription(supportProgress)}</p>
          </div>
          <div className="mt-4 w-full bg-amber-200/50 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${supportProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-violet-100 bg-violet-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-violet-800 leading-tight">Институциональное сопровождение</h3>
            <div className="mt-2 text-3xl font-bold text-violet-700">{institutionalProgress}%</div>
            <p className="mt-1 text-xs text-violet-600/80">{getBlockDescription(institutionalProgress)}</p>
          </div>
          <div className="mt-4 w-full bg-violet-200/50 rounded-full h-1.5">
            <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${institutionalProgress}%` }}></div>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-emerald-800 leading-tight">Работа с госзаказчиками</h3>
            <div className="mt-2 text-3xl font-bold text-emerald-700">{govClientsProgress}%</div>
            <p className="mt-1 text-xs text-emerald-600/80">{getBlockDescription(govClientsProgress)}</p>
          </div>
          <div className="mt-4 w-full bg-emerald-200/50 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${govClientsProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Текущая задача проекта</h2>

        {currentGoal && (
          <>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                <Calendar className="w-3 h-3 mr-1.5" />
                Период: {currentGoal.year} {currentGoal.quarter}
              </span>

              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                <Clock className="w-3 h-3 mr-1.5" />
                Срок задачи: до {formatDate(currentGoal.goal_deadline)}
              </span>

              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
                <Layers className="w-3 h-3 mr-1.5" />
                GR-блок: {currentGoal.gr_block}
              </span>

              {currentGoal.project_stage && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  Стадия проекта: {currentGoal.project_stage}
                </span>
              )}
            </div>

            <p className="text-xl font-medium text-slate-900 leading-snug mb-4">
              {currentGoal.goal_title}
            </p>

            <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 text-sm text-slate-600">
              <div>
                <span className="text-slate-400">Задач выполнено:</span> {currentGoalCompletedTasks} из {currentGoalTasks.length}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-end justify-between mb-2">
                <div className="text-2xl font-bold text-slate-900">Выполнение: {currentGoalProgress}%</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2">
                <div
                  className="bg-teal-500 h-2.5 rounded-full"
                  style={{ width: `${currentGoalProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-500">
                {currentGoal.progress_comment}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center text-blue-800 font-semibold text-sm mb-2">
                  <Target className="w-4 h-4 mr-2" />
                  Актуальная подзадача
                </div>
                <p className="text-sm text-blue-900/80 leading-relaxed">
                  {currentTask ? currentTask.task_title : 'Подзадача не найдена'}
                </p>
              </div>

              <div className="bg-amber-50/50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center text-amber-800 font-semibold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
                  Ключевой риск
                </div>
                <p className="text-sm text-amber-900/80 leading-relaxed">
                  {currentGoal.key_risk}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Готовность GR-контура: план vs факт</h2>
            <p className="text-sm text-slate-500 mt-1">Поквартальная динамика по выбранному году</p>
          </div>

          <div className="flex space-x-1 mt-4 sm:mt-0 bg-slate-100 p-1 rounded-lg">
            {['2026', '2027', '2028', '2029'].map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedYear === year
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData[selectedYear]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                label={{ value: 'Готовность, %', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 12, dy: 40, dx: 10 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [
                  `${value}%`,
                  name === 'plan' ? 'План' : 'Факт'
                ]}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="plan"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#94A3B8', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
                name="plan"
              />
              <Line
                type="monotone"
                dataKey="fact"
                stroke="#0F766E"
                strokeWidth={3}
                dot={{ r: 5, fill: '#0F766E', strokeWidth: 0 }}
                activeDot={{ r: 7 }}
                name="fact"
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

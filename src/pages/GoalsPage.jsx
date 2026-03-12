import React, { useState, useMemo } from 'react';
import {
  Calendar, Clock, Layers, AlertCircle, ChevronDown, ChevronUp,
  CheckCircle2, Circle, AlertTriangle, PlayCircle, Info
} from 'lucide-react';
import { goalsData, tasksData, formatDate } from '../data/dashboardData';

const getStatusColor = (status) => {
  switch (status) {
    case 'Выполнено': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'В процессе': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Не начато': return 'text-slate-600 bg-slate-100 border-slate-200';
    case 'Есть отклонение':
    case 'Просрочено':
    case 'Есть риск': return 'text-rose-700 bg-rose-50 border-rose-200';
    default: return 'text-slate-600 bg-slate-100 border-slate-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Выполнено': return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
    case 'В процессе': return <PlayCircle className="w-4 h-4 mr-1.5" />;
    case 'Не начато': return <Circle className="w-4 h-4 mr-1.5" />;
    case 'Есть отклонение':
    case 'Просрочено':
    case 'Есть риск': return <AlertTriangle className="w-4 h-4 mr-1.5" />;
    default: return <Circle className="w-4 h-4 mr-1.5" />;
  }
};

const GoalCard = ({ goal }) => {
  const [isTasksOpen, setIsTasksOpen] = useState(false);

  const goalTasks = tasksData
    .filter((t) => t.goal_id === goal.goal_id)
    .sort((a, b) => a.task_order - b.task_order);

  const completedTasksCount = goalTasks.filter(
    (task) => task.task_status === 'Выполнено'
  ).length;

  const totalTasksCount = goalTasks.length;

  const calculatedCompletionPercent =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
      <div className="p-6">
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              <Calendar className="w-3 h-3 mr-1.5" />
              Период: {goal.year} {goal.quarter}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              <Clock className="w-3 h-3 mr-1.5" />
              Срок цели: до {formatDate(goal.goal_deadline)}
            </span>

            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
              <Layers className="w-3 h-3 mr-1.5" />
              GR-блок: {goal.gr_block}
            </span>

            {goal.goal_status !== 'Не начато' && goal.project_stage && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                Стадия проекта: {goal.project_stage}
              </span>
            )}
          </div>

          <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${getStatusColor(goal.goal_status)} shrink-0`}>
            {getStatusIcon(goal.goal_status)}
            {goal.goal_status}
          </div>
        </div>

        <h3 className="text-xl font-medium text-slate-900 leading-snug mb-4">
          {goal.goal_title}
        </h3>

        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div>
            <span className="text-slate-400 font-medium">Задач выполнено:</span>{' '}
            {completedTasksCount} из {totalTasksCount}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end justify-between mb-2">
            <div className="text-lg font-bold text-slate-900">
              Выполнение: {calculatedCompletionPercent}%
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${calculatedCompletionPercent === 100 ? 'bg-emerald-500' : 'bg-teal-500'}`}
              style={{ width: `${calculatedCompletionPercent}%` }}
            ></div>
          </div>

          <p className="text-sm text-slate-600">
            {goal.progress_comment}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-2">
          <div className="flex items-center text-amber-800 font-semibold text-sm mb-1">
            <AlertCircle className="w-4 h-4 mr-2 text-amber-600" />
            Ключевой риск
          </div>
          <p className="text-sm text-amber-900/80 leading-relaxed">
            {goal.key_risk}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <button
          onClick={() => setIsTasksOpen(!isTasksOpen)}
          className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center">
            <Layers className="w-4 h-4 mr-2 text-slate-400" />
            Задачи по цели ({goalTasks.length})
          </div>
          {isTasksOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {isTasksOpen && (
          <div className="px-6 pb-4 pt-1">
            {goalTasks.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-2">Задачи пока не добавлены</p>
            ) : (
              <div className="space-y-2">
                {goalTasks.map((task) => (
                  <div
                    key={task.task_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 rounded-lg gap-3"
                  >
                    <div className="text-sm font-medium text-slate-800 flex-1">
                      {task.task_title}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${getStatusColor(task.task_status)}`}>
                        {task.task_status}
                      </span>

                      <span className="text-sm text-slate-500 w-28 text-right flex items-center justify-end">
                        <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
                        до {formatDate(task.task_deadline)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function GoalsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedBlock, setSelectedBlock] = useState('Все GR-блоки');

  const grBlocks = [
    'Все GR-блоки',
    'Геоаналитика',
    'Градостроительство и экология',
    'Господдержка и размещение',
    'Институциональное сопровождение',
    'Работа с госзаказчиками'
  ];

  const years = ['2026', '2027', '2028', '2029'];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

  const filteredGoals = useMemo(() => {
    let result = goalsData.filter((g) => g.year === selectedYear);

    if (selectedBlock !== 'Все GR-блоки') {
      result = result.filter((g) => g.gr_block === selectedBlock);
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.goal_deadline);
      const dateB = new Date(b.goal_deadline);

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [selectedYear, selectedBlock]);

  const goalsByQuarter = useMemo(() => {
    const grouped = { Q1: [], Q2: [], Q3: [], Q4: [] };

    filteredGoals.forEach((goal) => {
      if (grouped[goal.quarter]) grouped[goal.quarter].push(goal);
    });

    return grouped;
  }, [filteredGoals]);

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Цели и KPI</h1>
        <p className="text-slate-600 mt-1">Квартальные цели и показатели выполнения</p>
        <div className="flex items-center mt-3 text-sm text-slate-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Дата обновления: 12.03.2026</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="w-full sm:w-auto">
          <select
            className="w-full sm:w-64 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 outline-none"
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
          >
            {grBlocks.map((block) => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>

        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
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

      <div className="space-y-8">
        {quarters.map((quarter) => {
          const qGoals = goalsByQuarter[quarter];

          if (qGoals.length === 0) return null;

          return (
            <div key={quarter} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  {selectedYear} {quarter}
                </h2>
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                  {qGoals.length} {qGoals.length === 1 ? 'цель' : (qGoals.length >= 2 && qGoals.length <= 4 ? 'цели' : 'целей')}
                </span>
                <div className="flex-1 h-px bg-slate-200 ml-4"></div>
              </div>

              <div className="space-y-4">
                {qGoals.map((goal) => (
                  <GoalCard key={goal.goal_id} goal={goal} />
                ))}
              </div>
            </div>
          );
        })}

        {filteredGoals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-slate-900">Нет целей</h3>
            <p className="text-sm text-slate-500 mt-1">По заданным фильтрам цели не найдены.</p>
          </div>
        )}
      </div>
    </div>
  );
}

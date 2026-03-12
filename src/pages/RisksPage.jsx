import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Layers,
  Filter,
  CheckCircle2,
  Clock3,
} from 'lucide-react';
import {
  goalsData,
  getRiskLevel,
  getRiskImpact,
  getResponseStatus,
  getOwnerByBlock,
  getMitigationPlan,
} from '../data/dashboardData';

const getLevelClasses = (level) => {
  switch (level) {
    case 'Высокий':
      return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'Средний':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Низкий':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    default:
      return 'text-slate-700 bg-slate-100 border-slate-200';
  }
};

const getImpactClasses = (impact) => {
  switch (impact) {
    case 'Высокое':
      return 'text-rose-700 bg-rose-50 border-rose-200';
    case 'Среднее':
      return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Низкое':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    default:
      return 'text-slate-700 bg-slate-100 border-slate-200';
  }
};

const getResponseStatusClasses = (status) => {
  switch (status) {
    case 'В работе':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Не начато':
      return 'text-slate-600 bg-slate-100 border-slate-200';
    case 'Закрыто':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    default:
      return 'text-slate-700 bg-slate-100 border-slate-200';
  }
};

const getOutcomeClasses = (outcome) => {
  switch (outcome) {
    case 'На контроле':
      return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Риск обошелся':
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Ожидает оценки':
      return 'text-slate-600 bg-slate-100 border-slate-200';
    default:
      return 'text-slate-700 bg-slate-100 border-slate-200';
  }
};

const getRiskOutcome = (goal) => {
  if (goal.goal_status === 'В процессе') return 'На контроле';
  if (goal.goal_status === 'Выполнено') return 'Риск обошелся';
  return 'Ожидает оценки';
};

const shouldShowDetailedCard = (goal) => {
  return goal.goal_status === 'В процессе' || goal.goal_status === 'Выполнено';
};

const shouldShowMitigationPlan = (risk) => {
  return risk.goal_status === 'В процессе' && risk.response_status === 'В работе';
};

const DetailedRiskCard = ({ risk }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
          {risk.gr_block}
        </span>

        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          {risk.year} {risk.quarter}
        </span>

        {risk.project_stage && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {risk.project_stage}
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-slate-900 leading-snug mb-3">
        {risk.key_risk}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed mb-5">
        {risk.goal_title}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
        <div>
          <div className="text-xs text-slate-500 mb-2">Уровень риска</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getLevelClasses(risk.risk_level)}`}>
            {risk.risk_level}
          </span>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">Влияние</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getImpactClasses(risk.impact)}`}>
            {risk.impact}
          </span>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">Статус реагирования</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getResponseStatusClasses(risk.response_status)}`}>
            {risk.response_status}
          </span>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">Исход риска</div>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-medium border ${getOutcomeClasses(risk.risk_outcome)}`}>
            {risk.risk_outcome}
          </span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs text-slate-500">Ответственный</div>
            <div className="text-base font-semibold text-slate-900">
              {risk.owner}
            </div>
          </div>
        </div>

        {shouldShowMitigationPlan(risk) && (
          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-500">Мера реагирования</div>
              <div className="text-base font-semibold text-slate-900 leading-snug">
                {risk.mitigation_plan}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CompactRiskCard = ({ risk }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100">
            {risk.gr_block}
          </span>

          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {risk.year} {risk.quarter}
          </span>
        </div>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getOutcomeClasses(risk.risk_outcome)}`}>
          {risk.risk_outcome}
        </span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2">
        {risk.key_risk}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        {risk.goal_title}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getLevelClasses(risk.risk_level)}`}>
          Риск: {risk.risk_level}
        </span>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getImpactClasses(risk.impact)}`}>
          Влияние: {risk.impact}
        </span>
      </div>
    </div>
  );
};

export default function RisksPage() {
  const [selectedYear, setSelectedYear] = useState('Все годы');
  const [selectedBlock, setSelectedBlock] = useState('Все GR-блоки');

  const years = ['Все годы', '2026', '2027', '2028', '2029'];
  const grBlocks = [
    'Все GR-блоки',
    'Геоаналитика',
    'Градостроительство и экология',
    'Господдержка и размещение',
    'Институциональное сопровождение',
    'Работа с госзаказчиками',
  ];

  const risksData = useMemo(() => {
    return goalsData
      .filter((goal) => goal.key_risk && goal.key_risk.trim() !== '')
      .map((goal) => ({
        ...goal,
        risk_id: `RISK_${goal.goal_id}`,
        risk_level: getRiskLevel(goal),
        impact: getRiskImpact(goal),
        response_status: getResponseStatus(goal),
        owner: getOwnerByBlock(goal.gr_block),
        mitigation_plan: getMitigationPlan(goal),
        risk_outcome: getRiskOutcome(goal),
        is_detailed: shouldShowDetailedCard(goal),
      }));
  }, []);

  const filteredRisks = useMemo(() => {
    let result = [...risksData];

    if (selectedYear !== 'Все годы') {
      result = result.filter((risk) => risk.year === selectedYear);
    }

    if (selectedBlock !== 'Все GR-блоки') {
      result = result.filter((risk) => risk.gr_block === selectedBlock);
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.goal_deadline);
      const dateB = new Date(b.goal_deadline);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [risksData, selectedYear, selectedBlock]);

  const activeOrResolvedRisks = useMemo(() => {
    return filteredRisks.filter((risk) => risk.is_detailed);
  }, [filteredRisks]);

  const futureRisks = useMemo(() => {
    return filteredRisks.filter((risk) => !risk.is_detailed);
  }, [filteredRisks]);

  const totalRisks = filteredRisks.length;

  const activeCount = activeOrResolvedRisks.filter((risk) => risk.goal_status === 'В процессе').length;
  const resolvedCount = activeOrResolvedRisks.filter((risk) => risk.goal_status === 'Выполнено').length;
  const pendingCount = futureRisks.length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
          <h1 className="text-2xl font-bold text-slate-900">Риски</h1>
        </div>

        <p className="text-slate-600 mt-2">Актуальные и ожидаемые риски по направлениям GR</p>

        <div className="flex items-center mt-3 text-sm text-slate-500">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Дата отчета: 12.03.2026</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-64">
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 pl-10 outline-none"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              {grBlocks.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
            <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 pl-10 outline-none"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {totalRisks} {totalRisks === 1 ? 'риск' : (totalRisks >= 2 && totalRisks <= 4 ? 'риска' : 'рисков')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
            <Clock3 className="w-4 h-4" />
            На контроле
          </div>
          <div className="text-2xl font-bold text-slate-900">{activeCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Риск обошелся
          </div>
          <div className="text-2xl font-bold text-slate-900">{resolvedCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <AlertTriangle className="w-4 h-4" />
            Ожидают оценки
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
        </div>
      </div>

      {filteredRisks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
          <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-slate-900">Риски не найдены</h3>
          <p className="text-sm text-slate-500 mt-1">По выбранным фильтрам нет записей.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeOrResolvedRisks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">Подробные карточки</h2>
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                  {activeOrResolvedRisks.length}
                </span>
              </div>

              <div className="space-y-4">
                {activeOrResolvedRisks.map((risk) => (
                  <DetailedRiskCard key={risk.risk_id} risk={risk} />
                ))}
              </div>
            </section>
          )}

          {futureRisks.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">Ожидаемые риски</h2>
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                  {futureRisks.length}
                </span>
              </div>

              <div className="space-y-3">
                {futureRisks.map((risk) => (
                  <CompactRiskCard key={risk.risk_id} risk={risk} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { loadData, saveData, exportData, importData, generateId } from './utils/storage';
import { addDays, todayISO, formatRelativeTime, formatDate, daysFromNow, getUrgencyLevel, getUrgencyColor, getUrgencyEmoji } from './utils/dates';
import { PRELITIGATION_TASKS, LITIGATION_TASKS, TASK_CATEGORIES } from './data/templates';
import './App.css';

// ─── Initial state ──────────────────────────────────────────────────────────
const INITIAL_STATE = { cases: [], miscTasks: [], lastSaved: null };

// ─── Urgency badge ───────────────────────────────────────────────────────────
function UrgencyBadge({ dueDate }) {
  const days = daysFromNow(dueDate);
  const level = getUrgencyLevel(days);
  if (level === 'none' || level === 'normal') return null;
  const color = getUrgencyColor(level);
  const emoji = getUrgencyEmoji(level);
  const label = formatRelativeTime(dueDate);
  return (
    <span className="urgency-badge" style={{ background: color + '22', color, border: `1px solid ${color}66` }}>
      {emoji} {label}
    </span>
  );
}

// ─── Task row ────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDue, setEditDue] = useState(task.dueDate || '');
  const [editNote, setEditNote] = useState(task.note || '');
  const days = daysFromNow(task.dueDate);
  const level = getUrgencyLevel(days);
  const urgencyColor = getUrgencyColor(level);
  const catColor = TASK_CATEGORIES[task.category] || TASK_CATEGORIES['Other'];

  function saveEdit() {
    onUpdate(task.id, { title: editTitle, dueDate: editDue || null, note: editNote });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="task-row editing">
        <div className="task-edit-fields">
          <input
            className="task-edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()}
            autoFocus
          />
          <div className="task-edit-row2">
            <div className="task-edit-date-wrapper">
              <span className="task-edit-date-label">📅 Due Date</span>
              <input
                type="date"
                className="task-edit-date"
                value={editDue}
                onChange={e => setEditDue(e.target.value)}
              />
            </div>
            <select
              className="task-edit-cat"
              value={task.category || 'Other'}
              onChange={e => onUpdate(task.id, { category: e.target.value })}
            >
              {Object.keys(TASK_CATEGORIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <textarea
            className="task-edit-note"
            placeholder="Notes (optional)"
            value={editNote}
            onChange={e => setEditNote(e.target.value)}
            rows={2}
          />
          <div className="task-edit-actions">
            <button className="btn-save" onClick={saveEdit}>✓ Save</button>
            <button className="btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn-delete" onClick={() => onDelete(task.id)}>🗑 Delete</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`task-row ${task.completed ? 'completed' : ''} ${level !== 'none' && level !== 'normal' && !task.completed ? `urgency-${level}` : ''}`}
      style={urgencyColor && !task.completed ? { borderLeft: `3px solid ${urgencyColor}` } : {}}
    >
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-body" onClick={() => !task.completed && setEditing(true)}>
        <div className="task-title-row">
          <span className="task-title">{task.title}</span>
          <span className="task-cat-dot" style={{ background: catColor }} title={task.category} />
        </div>
        <div className="task-meta">
          {task.dueDate && !task.completed && <UrgencyBadge dueDate={task.dueDate} />}
          {task.dueDate && task.completed && (
            <span className="task-date-quiet">Due {formatDate(task.dueDate)}</span>
          )}
          {task.critical && !task.completed && (
            <span className="critical-tag">CRITICAL</span>
          )}
          {task.note && <span className="task-note-preview">{task.note}</span>}
        </div>
      </div>
      {!task.completed && (
        <button className="task-edit-btn" onClick={() => setEditing(true)} title="Edit task">✏️</button>
      )}
    </div>
  );
}

// ─── Quick Add Task ──────────────────────────────────────────────────────────
function QuickAddTask({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Other');
  const [critical, setCritical] = useState(false);
  const inputRef = useRef();

  function handleAdd() {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), dueDate: dueDate || null, category, critical });
    setTitle('');
    setDueDate('');
    setCategory('Other');
    setCritical(false);
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button className="quick-add-trigger" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
        <span className="plus-icon">+</span> Add Task
      </button>
    );
  }

  return (
    <div className="quick-add-panel">
      <input
        ref={inputRef}
        className="quick-add-input"
        placeholder="Task title... (press Enter to add)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setOpen(false); }}
        autoFocus
      />
      <div className="quick-add-row2">
        <div className="quick-add-date-wrapper">
          <span className="quick-add-date-label">📅 Due Date</span>
          <input type="date" className="quick-add-date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <select className="quick-add-cat" value={category} onChange={e => setCategory(e.target.value)}>
          {Object.keys(TASK_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="quick-add-critical">
          <input type="checkbox" checked={critical} onChange={e => setCritical(e.target.checked)} />
          Critical
        </label>
      </div>
      <div className="quick-add-actions">
        <button className="btn-add-task" onClick={handleAdd}>Add Task</button>
        <button className="btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Case Detail View ────────────────────────────────────────────────────────
function CaseDetail({ caseData, onUpdate, onBack, onDelete }) {
  const [activeFilter, setActiveFilter] = useState('pending');
  const [showCompleted, setShowCompleted] = useState(false);

  const pending = caseData.tasks.filter(t => !t.completed);
  const completed = caseData.tasks.filter(t => t.completed);

  // Sort pending by urgency then due date
  const sortedPending = [...pending].sort((a, b) => {
    const da = daysFromNow(a.dueDate);
    const db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

  // Overdue & critical tasks for the "FOCUS NOW" section
  const focusNow = sortedPending.filter(t => {
    const days = daysFromNow(t.dueDate);
    return days !== null && (days <= 0 || (days <= 3 && t.critical));
  });

  const overdueCount = pending.filter(t => {
    const days = daysFromNow(t.dueDate);
    return days !== null && days < 0;
  }).length;

  function toggleTask(taskId) {
    const updated = caseData.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayISO() : null } : t
    );
    onUpdate({ tasks: updated });
  }

  function deleteTask(taskId) {
    onUpdate({ tasks: caseData.tasks.filter(t => t.id !== taskId) });
  }

  function updateTask(taskId, changes) {
    const updated = caseData.tasks.map(t => t.id === taskId ? { ...t, ...changes } : t);
    onUpdate({ tasks: updated });
  }

  function addTask(taskData) {
    const newTask = { id: generateId(), ...taskData, completed: false, createdAt: todayISO() };
    onUpdate({ tasks: [...caseData.tasks, newTask] });
  }

  const progress = caseData.tasks.length > 0
    ? Math.round((completed.length / caseData.tasks.length) * 100)
    : 0;

  const caseTypeLabel = caseData.type === 'prelitigation' ? 'Pre-Litigation' : 'Litigation';
  const caseTypeBadgeClass = caseData.type === 'prelitigation' ? 'badge-prelit' : 'badge-lit';

  return (
    <div className="case-detail">
      {/* Header */}
      <div className="case-detail-header">
        <button className="back-btn" onClick={onBack}>← All Cases</button>
        <div className="case-header-info">
          <div className="case-title-row">
            <h2 className="case-detail-title">{caseData.clientName}</h2>
            <span className={`case-type-badge ${caseTypeBadgeClass}`}>{caseTypeLabel}</span>
          </div>
          {caseData.caseNumber && <div className="case-number">Case #: {caseData.caseNumber}</div>}
          {caseData.description && <div className="case-description">{caseData.description}</div>}
          <div className="case-opened">Opened: {formatDate(caseData.openedDate)}</div>
        </div>
        <button className="btn-danger-sm" onClick={() => { if (window.confirm(`Delete case for ${caseData.clientName}? This cannot be undone.`)) onDelete(); }}>
          Delete Case
        </button>
      </div>

      {/* Progress bar */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Case Progress</span>
          <span className="progress-pct">{progress}%</span>
          <span className="progress-counts">{completed.length} of {caseData.tasks.length} tasks done</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* FOCUS NOW — overdue & critical within 3 days */}
      {focusNow.length > 0 && (
        <div className="focus-now-section">
          <div className="focus-now-header">
            <span className="focus-now-icon">🎯</span>
            <span className="focus-now-title">FOCUS NOW</span>
            {overdueCount > 0 && <span className="overdue-count">{overdueCount} OVERDUE</span>}
          </div>
          <div className="focus-now-tasks">
            {focusNow.map(t => (
              <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
            ))}
          </div>
        </div>
      )}

      {/* All pending tasks */}
      <div className="tasks-section">
        <div className="tasks-section-header">
          <h3>Pending Tasks <span className="task-count-badge">{pending.length}</span></h3>
        </div>
        <div className="tasks-list">
          {sortedPending.length === 0 && (
            <div className="empty-tasks">🎉 All tasks complete!</div>
          )}
          {sortedPending.map(t => (
            <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
          ))}
        </div>
        <QuickAddTask onAdd={addTask} />
      </div>

      {/* Completed tasks */}
      {completed.length > 0 && (
        <div className="completed-section">
          <button className="toggle-completed" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? '▼' : '▶'} Completed ({completed.length})
          </button>
          {showCompleted && (
            <div className="tasks-list completed-list">
              {completed.map(t => (
                <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── New Case Modal ──────────────────────────────────────────────────────────
function NewCaseModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1 = type, 2 = details
  const [caseType, setCaseType] = useState(null);
  const [clientName, setClientName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [description, setDescription] = useState('');
  const [openedDate, setOpenedDate] = useState(todayISO());

  function handleCreate() {
    if (!clientName.trim()) return;
    const templates = caseType === 'prelitigation' ? PRELITIGATION_TASKS : LITIGATION_TASKS;
    const tasks = templates.map(t => ({
      id: generateId(),
      title: t.title,
      category: t.category,
      critical: t.critical,
      dueDate: addDays(openedDate, t.defaultDaysFromOpen).toISOString().split('T')[0],
      completed: false,
      createdAt: todayISO(),
    }));
    onCreate({
      id: generateId(),
      type: caseType,
      clientName: clientName.trim(),
      caseNumber: caseNumber.trim(),
      description: description.trim(),
      openedDate,
      tasks,
      createdAt: todayISO(),
    });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>New Case</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {step === 1 && (
          <div className="modal-step">
            <p className="modal-subtitle">What type of case is this?</p>
            <div className="case-type-choices">
              <button
                className={`case-type-btn prelit ${caseType === 'prelitigation' ? 'selected' : ''}`}
                onClick={() => { setCaseType('prelitigation'); setStep(2); }}
              >
                <span className="case-type-icon">📋</span>
                <span className="case-type-name">Pre-Litigation</span>
                <span className="case-type-desc">{PRELITIGATION_TASKS.length} standard tasks auto-loaded</span>
              </button>
              <button
                className={`case-type-btn lit ${caseType === 'litigation' ? 'selected' : ''}`}
                onClick={() => { setCaseType('litigation'); setStep(2); }}
              >
                <span className="case-type-icon">⚖️</span>
                <span className="case-type-name">Litigation</span>
                <span className="case-type-desc">{LITIGATION_TASKS.length} standard tasks auto-loaded</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-step">
            <div className="modal-back-row">
              <button className="modal-back" onClick={() => setStep(1)}>← Change type</button>
              <span className={`case-type-badge ${caseType === 'prelitigation' ? 'badge-prelit' : 'badge-lit'}`}>
                {caseType === 'prelitigation' ? 'Pre-Litigation' : 'Litigation'}
              </span>
            </div>
            <div className="modal-field">
              <label>Client Name *</label>
              <input
                className="modal-input"
                placeholder="e.g. Jane Smith"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && clientName.trim() && handleCreate()}
                autoFocus
              />
            </div>
            <div className="modal-field">
              <label>Case / File Number</label>
              <input
                className="modal-input"
                placeholder="e.g. 2024-0123"
                value={caseNumber}
                onChange={e => setCaseNumber(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Brief Description</label>
              <input
                className="modal-input"
                placeholder="e.g. Slip and fall, grocery store"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Date Opened</label>
              <input
                type="date"
                className="modal-input"
                value={openedDate}
                onChange={e => setOpenedDate(e.target.value)}
              />
            </div>
            <div className="modal-note">
              📌 Task due dates will be calculated automatically from the open date.
            </div>
            <button
              className="btn-create-case"
              onClick={handleCreate}
              disabled={!clientName.trim()}
            >
              Create Case →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Case Card (list view) ───────────────────────────────────────────────────
function CaseCard({ caseData, onClick }) {
  const pending = caseData.tasks.filter(t => !t.completed);
  const completed = caseData.tasks.filter(t => t.completed);
  const progress = caseData.tasks.length > 0 ? Math.round((completed.length / caseData.tasks.length) * 100) : 0;

  // Find most urgent pending task
  const sortedPending = [...pending].sort((a, b) => {
    const da = daysFromNow(a.dueDate);
    const db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });
  const mostUrgent = sortedPending[0];
  const overdueCount = pending.filter(t => {
    const days = daysFromNow(t.dueDate);
    return days !== null && days < 0;
  }).length;
  const dueTodayCount = pending.filter(t => {
    const days = daysFromNow(t.dueDate);
    return days !== null && days === 0;
  }).length;

  const urgencyDays = mostUrgent ? daysFromNow(mostUrgent.dueDate) : null;
  const urgencyLevel = getUrgencyLevel(urgencyDays);
  const urgencyColor = getUrgencyColor(urgencyLevel);

  return (
    <div
      className={`case-card ${overdueCount > 0 ? 'has-overdue' : ''}`}
      onClick={onClick}
      style={urgencyColor ? { borderTop: `3px solid ${urgencyColor}` } : {}}
    >
      <div className="case-card-header">
        <div>
          <h3 className="case-card-name">{caseData.clientName}</h3>
          {caseData.caseNumber && <div className="case-card-num">#{caseData.caseNumber}</div>}
          {caseData.description && <div className="case-card-desc">{caseData.description}</div>}
        </div>
        <span className={`case-type-badge ${caseData.type === 'prelitigation' ? 'badge-prelit' : 'badge-lit'}`}>
          {caseData.type === 'prelitigation' ? 'Pre-Lit' : 'Lit'}
        </span>
      </div>

      {/* Alert badges */}
      <div className="case-alert-row">
        {overdueCount > 0 && (
          <span className="alert-badge overdue-badge">🚨 {overdueCount} OVERDUE</span>
        )}
        {dueTodayCount > 0 && (
          <span className="alert-badge today-badge">🔥 {dueTodayCount} DUE TODAY</span>
        )}
        {overdueCount === 0 && dueTodayCount === 0 && mostUrgent?.dueDate && (
          <UrgencyBadge dueDate={mostUrgent.dueDate} />
        )}
      </div>

      {/* Progress */}
      <div className="case-card-progress">
        <div className="progress-bar-track slim">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-text">{progress}% · {pending.length} remaining</span>
      </div>
    </div>
  );
}

// ─── Dashboard / Alerts Panel ────────────────────────────────────────────────
function AlertsPanel({ cases }) {
  const allUrgentTasks = [];
  cases.forEach(c => {
    c.tasks.filter(t => !t.completed).forEach(t => {
      const days = daysFromNow(t.dueDate);
      const level = getUrgencyLevel(days);
      if (level !== 'none' && level !== 'normal' && level !== 'soon') {
        allUrgentTasks.push({ ...t, caseName: c.clientName, caseId: c.id, days });
      }
    });
  });

  allUrgentTasks.sort((a, b) => (a.days ?? 999) - (b.days ?? 999));

  if (allUrgentTasks.length === 0) return null;

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <span className="alerts-icon">🚨</span>
        <span className="alerts-title">NEEDS ATTENTION NOW</span>
        <span className="alerts-count">{allUrgentTasks.length}</span>
      </div>
      <div className="alerts-list">
        {allUrgentTasks.map(t => {
          const level = getUrgencyLevel(t.days);
          const color = getUrgencyColor(level);
          return (
            <div key={t.id} className="alert-item" style={{ borderLeft: `3px solid ${color}` }}>
              <div className="alert-case-name">{t.caseName}</div>
              <div className="alert-task-title">{t.title}</div>
              <UrgencyBadge dueDate={t.dueDate} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Upcoming Deadlines Panel ────────────────────────────────────────────────
function UpcomingDeadlines({ cases, miscTasks, onSelectCase }) {
  const allTasks = [];

  cases.forEach(c => {
    c.tasks.filter(t => !t.completed && t.dueDate).forEach(t => {
      allTasks.push({ ...t, caseName: c.clientName, caseId: c.id, isMisc: false });
    });
  });
  (miscTasks || []).filter(t => !t.completed && t.dueDate).forEach(t => {
    allTasks.push({ ...t, caseName: 'Misc', caseId: null, isMisc: true });
  });

  allTasks.sort((a, b) => {
    const da = daysFromNow(a.dueDate);
    const db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

  const top25 = allTasks.slice(0, 25);
  if (top25.length === 0) return null;

  return (
    <div className="deadlines-panel">
      <div className="deadlines-header">
        <span className="deadlines-icon">🗓</span>
        <span className="deadlines-title">Upcoming Deadlines</span>
        <span className="task-count-badge">{top25.length} of {allTasks.length}</span>
      </div>
      <div className="deadlines-list">
        {top25.map(t => {
          const days = daysFromNow(t.dueDate);
          const level = getUrgencyLevel(days);
          const color = getUrgencyColor(level);
          return (
            <div
              key={t.id}
              className="deadline-item"
              style={color ? { borderLeftColor: color } : {}}
              onClick={() => t.caseId && onSelectCase(t.caseId)}
              title={t.caseId ? `Go to ${t.caseName}` : ''}
              role={t.caseId ? 'button' : undefined}
              tabIndex={t.caseId ? 0 : undefined}
            >
              <div className="deadline-item-left">
                <div className="deadline-task-title">{t.title}</div>
                <div className="deadline-case-name">
                  {t.isMisc
                    ? <span className="misc-label">📋 Misc</span>
                    : `⚖️ ${t.caseName}`}
                  {t.critical && <span className="critical-tag" style={{ marginLeft: 6 }}>CRITICAL</span>}
                </div>
              </div>
              <div className="deadline-badge-col">
                <UrgencyBadge dueDate={t.dueDate} />
                {(level === 'none' || level === 'normal') && (
                  <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                    {formatDate(t.dueDate)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Global Capture Modal ────────────────────────────────────────────────────
function GlobalCaptureModal({ cases, onClose, onAddToCase, onAddToMisc }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [critical, setCritical] = useState(false);
  const [destination, setDestination] = useState('misc');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  function handleAdd() {
    if (!title.trim()) return;
    const task = {
      id: generateId(),
      title: title.trim(),
      dueDate: dueDate || null,
      critical,
      category: 'Other',
      completed: false,
      createdAt: todayISO(),
    };
    if (destination === 'misc') {
      onAddToMisc(task);
    } else {
      onAddToCase(destination, task);
    }
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal capture-modal">
        <div className="modal-header">
          <h2>⚡ Quick Capture</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">Capture it now, sort it out later.</p>

        <div className="modal-field">
          <label>Task</label>
          <input
            ref={inputRef}
            className="modal-input capture-input"
            placeholder="What needs to happen?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && title.trim() && handleAdd()}
          />
        </div>

        <div className="modal-field">
          <label>Due date (optional)</label>
          <input
            type="date"
            className="modal-input"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <label>Add to</label>
          <select
            className="modal-input"
            value={destination}
            onChange={e => setDestination(e.target.value)}
          >
            <option value="misc">📋 Misc / Firm Tasks</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                ⚖️ {c.clientName}{c.caseNumber ? ` (#${c.caseNumber})` : ''}
              </option>
            ))}
          </select>
        </div>

        <label className="capture-critical-row">
          <input type="checkbox" checked={critical} onChange={e => setCritical(e.target.checked)} />
          Mark as critical
        </label>

        <button
          className="btn-create-case"
          onClick={handleAdd}
          disabled={!title.trim()}
          style={{ marginTop: 16 }}
        >
          Add Task →
        </button>
      </div>
    </div>
  );
}

// ─── Floating Capture Button ─────────────────────────────────────────────────
function FloatingCaptureButton({ onClick }) {
  return (
    <button className="floating-capture-btn" onClick={onClick} title="Quick capture a task">
      <span className="floating-plus">+</span>
    </button>
  );
}

// ─── Misc Task Panel ─────────────────────────────────────────────────────────
function MiscPanel({ tasks, onUpdate }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  const sorted = [...pending].sort((a, b) => {
    const da = daysFromNow(a.dueDate);
    const db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1;
    if (db === null) return -1;
    return da - db;
  });

  function toggleTask(id) {
    onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayISO() : null } : t));
  }
  function deleteTask(id) { onUpdate(tasks.filter(t => t.id !== id)); }
  function updateTask(id, changes) { onUpdate(tasks.map(t => t.id === id ? { ...t, ...changes } : t)); }
  function addTask(taskData) {
    onUpdate([...tasks, { id: generateId(), ...taskData, completed: false, createdAt: todayISO() }]);
  }

  if (tasks.length === 0) return null;

  return (
    <div className="misc-panel">
      <div className="misc-panel-header">
        <span className="misc-icon">📋</span>
        <span className="misc-title">Misc / Firm Tasks</span>
        <span className="task-count-badge">{pending.length} pending</span>
      </div>
      <div className="tasks-list">
        {sorted.map(t => (
          <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
        ))}
        {sorted.length === 0 && <div className="empty-tasks">🎉 All misc tasks done!</div>}
      </div>
      <QuickAddTask onAdd={addTask} />
      {completed.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <button className="toggle-completed" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? '▼' : '▶'} Completed ({completed.length})
          </button>
          {showCompleted && (
            <div className="tasks-list completed-list" style={{ marginTop: 8 }}>
              {completed.map(t => (
                <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(INITIAL_STATE);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [showNewCase, setShowNewCase] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('urgency');
  const [saved, setSaved] = useState(true);
  const fileInputRef = useRef();

  // Load on mount
  useEffect(() => {
    const loaded = loadData();
    if (loaded) setData({ miscTasks: [], ...loaded });
  }, []);

  // Auto-save on change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveData(data);
      setSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  function updateData(newData) {
    setSaved(false);
    setData(newData);
  }

  function createCase(newCase) {
    updateData({ ...data, cases: [...data.cases, newCase] });
    setShowNewCase(false);
    setSelectedCaseId(newCase.id);
  }

  function updateCase(caseId, changes) {
    updateData({
      ...data,
      cases: data.cases.map(c => c.id === caseId ? { ...c, ...changes } : c)
    });
  }

  function deleteCase(caseId) {
    updateData({ ...data, cases: data.cases.filter(c => c.id !== caseId) });
    setSelectedCaseId(null);
  }

  function addTaskToMisc(task) {
    updateData({ ...data, miscTasks: [...(data.miscTasks || []), task] });
  }

  function addTaskToCase(caseId, task) {
    updateData({
      ...data,
      cases: data.cases.map(c => c.id === caseId ? { ...c, tasks: [...c.tasks, task] } : c)
    });
  }

  function updateMiscTasks(newTasks) {
    updateData({ ...data, miscTasks: newTasks });
  }

  // Filter & sort cases
  let filteredCases = data.cases.filter(c => {
    const matchesSearch = !searchQuery ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  if (sortBy === 'urgency') {
    filteredCases = filteredCases.sort((a, b) => {
      const getMinDays = (c) => {
        const pending = c.tasks.filter(t => !t.completed);
        const days = pending.map(t => daysFromNow(t.dueDate)).filter(d => d !== null);
        return days.length > 0 ? Math.min(...days) : 999;
      };
      return getMinDays(a) - getMinDays(b);
    });
  } else if (sortBy === 'alpha') {
    filteredCases = filteredCases.sort((a, b) => a.clientName.localeCompare(b.clientName));
  } else if (sortBy === 'opened') {
    filteredCases = filteredCases.sort((a, b) => new Date(b.openedDate) - new Date(a.openedDate));
  }

  const selectedCase = data.cases.find(c => c.id === selectedCaseId);

  const totalOverdue = data.cases.reduce((sum, c) => {
    return sum + c.tasks.filter(t => !t.completed && daysFromNow(t.dueDate) !== null && daysFromNow(t.dueDate) < 0).length;
  }, 0);

  // If viewing a case detail
  if (selectedCase) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <span className="app-logo">⚖️</span>
            <span className="app-name">CaseFlow</span>
          </div>
          <div className="header-right">
            {!saved && <span className="saving-indicator">saving...</span>}
            {saved && <span className="saved-indicator">✓ saved</span>}
          </div>
        </header>
        <main className="app-main">
          <CaseDetail
            caseData={selectedCase}
            onUpdate={(changes) => updateCase(selectedCase.id, changes)}
            onBack={() => setSelectedCaseId(null)}
            onDelete={() => deleteCase(selectedCase.id)}
          />
        </main>
        <FloatingCaptureButton onClick={() => setShowCapture(true)} />
        {showCapture && (
          <GlobalCaptureModal
            cases={data.cases}
            onClose={() => setShowCapture(false)}
            onAddToCase={addTaskToCase}
            onAddToMisc={addTaskToMisc}
          />
        )}
      </div>
    );
  }

  // Case list / dashboard view
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <span className="app-logo">⚖️</span>
          <span className="app-name">CaseFlow</span>
          {totalOverdue > 0 && (
            <span className="header-overdue-badge">{totalOverdue} OVERDUE</span>
          )}
        </div>
        <div className="header-right">
          {!saved && <span className="saving-indicator">saving...</span>}
          {saved && <span className="saved-indicator">✓ saved</span>}
          <button className="btn-settings" onClick={() => setShowSettings(!showSettings)} title="Settings / Backup">⚙️</button>
          <button className="btn-new-case" onClick={() => setShowNewCase(true)}>+ New Case</button>
        </div>
      </header>

      {/* Settings drawer */}
      {showSettings && (
        <div className="settings-bar">
          <div className="settings-content">
            <span className="settings-label">Data Backup:</span>
            <button className="btn-export" onClick={() => exportData(data)}>⬇ Export JSON</button>
            <button className="btn-import" onClick={() => fileInputRef.current.click()}>⬆ Import JSON</button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                importData(file, (err, imported) => {
                  if (err) { alert('Could not read that file.'); return; }
                  if (window.confirm('Replace all current data with this backup?')) {
                    updateData(imported);
                    setShowSettings(false);
                  }
                });
                e.target.value = '';
              }}
            />
            <span className="settings-tip">Export your data and store it in Google Drive or Dropbox for cross-device access.</span>
          </div>
        </div>
      )}

      <main className="app-main">
        {/* Dashboard quick-capture bar */}
        <div className="dashboard-capture-bar">
          <button className="dashboard-capture-btn" onClick={() => setShowCapture(true)}>
            <span className="dashboard-capture-plus">+</span>
            <span>Quick capture a task...</span>
          </button>
        </div>

        {/* Alerts panel */}
        <AlertsPanel cases={data.cases} />

        {/* Upcoming deadlines */}
        <UpcomingDeadlines
          cases={data.cases}
          miscTasks={data.miscTasks}
          onSelectCase={setSelectedCaseId}
        />

        {/* Misc tasks */}
        <MiscPanel tasks={data.miscTasks || []} onUpdate={updateMiscTasks} />

        {/* Controls */}
        <div className="list-controls">
          <input
            className="search-input"
            placeholder="🔍 Search cases..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="filter-buttons">
            {['all', 'prelitigation', 'litigation'].map(f => (
              <button
                key={f}
                className={`filter-btn ${filterType === f ? 'active' : ''}`}
                onClick={() => setFilterType(f)}
              >
                {f === 'all' ? 'All' : f === 'prelitigation' ? 'Pre-Lit' : 'Litigation'}
              </button>
            ))}
          </div>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="urgency">Sort: Most Urgent</option>
            <option value="alpha">Sort: A–Z</option>
            <option value="opened">Sort: Newest</option>
          </select>
        </div>

        {/* Case list */}
        {data.cases.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚖️</div>
            <h2>No cases yet</h2>
            <p>Create your first case to get started.</p>
            <button className="btn-new-case large" onClick={() => setShowNewCase(true)}>+ Create First Case</button>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="empty-state">
            <p>No cases match your search.</p>
          </div>
        ) : (
          <div className="cases-grid">
            {filteredCases.map(c => (
              <CaseCard key={c.id} caseData={c} onClick={() => setSelectedCaseId(c.id)} />
            ))}
          </div>
        )}
      </main>

      {showNewCase && (
        <NewCaseModal onClose={() => setShowNewCase(false)} onCreate={createCase} />
      )}
      <FloatingCaptureButton onClick={() => setShowCapture(true)} />
      {showCapture && (
        <GlobalCaptureModal
          cases={data.cases}
          onClose={() => setShowCapture(false)}
          onAddToCase={addTaskToCase}
          onAddToMisc={addTaskToMisc}
        />
      )}
    </div>
  );
}

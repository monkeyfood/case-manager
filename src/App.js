import React, { useState, useEffect, useRef } from 'react';
import { loadData, saveData, exportData, importData, generateId } from './utils/storage';
import { addDays, todayISO, formatRelativeTime, formatDate, daysFromNow, getUrgencyLevel, getUrgencyColor, getUrgencyEmoji } from './utils/dates';
import { PRELITIGATION_TASKS, LITIGATION_TASKS, TASK_CATEGORIES } from './data/templates';
import './App.css';

const INITIAL_STATE = { cases: [], miscTasks: [], lastSaved: null };

// ─── Urgency badge ────────────────────────────────────────────────────────────
function UrgencyBadge({ dueDate }) {
  const days = daysFromNow(dueDate);
  const level = getUrgencyLevel(days);
  if (level === 'none' || level === 'normal') return null;
  const emoji = getUrgencyEmoji(level);
  const label = formatRelativeTime(dueDate);
  const styles = {
    overdue: { background: 'var(--overdue-bg)', color: 'var(--overdue)', border: '1px solid #fca5a5' },
    today:   { background: 'var(--today-bg)',   color: 'var(--today)',   border: '1px solid #fed7aa' },
    critical:{ background: 'var(--today-bg)',   color: 'var(--today)',   border: '1px solid #fed7aa' },
    urgent:  { background: 'var(--urgent-bg)',  color: 'var(--urgent)',  border: '1px solid #fde68a' },
    soon:    { background: 'var(--soon-bg)',     color: 'var(--soon)',    border: '1px solid #bae6fd' },
  };
  return (
    <span className="urgency-badge" style={styles[level] || {}}>
      {emoji} {label}
    </span>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDue, setEditDue] = useState(task.dueDate || '');
  const [editNote, setEditNote] = useState(task.note || '');
  const days = daysFromNow(task.dueDate);
  const level = getUrgencyLevel(days);
  const urgencyColor = getUrgencyColor(level);
  const catColor = TASK_CATEGORIES[task.category] || TASK_CATEGORIES['Other'];
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const hasSubtasks = subtasks.length > 0;

  function saveEdit() {
    onUpdate(task.id, { title: editTitle, dueDate: editDue || null, note: editNote });
    setEditing(false);
  }
  function toggleSubtask(subtaskId) {
    const updated = subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
    onUpdate(task.id, { subtasks: updated });
  }

  if (editing) {
    return (
      <div className="task-row editing">
        <div className="task-edit-fields">
          <input className="task-edit-input" value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit()} autoFocus />
          <div className="task-edit-row2">
            <div className="task-edit-date-wrapper">
              <span className="task-edit-date-label">📅 Due Date</span>
              <input type="date" className="task-edit-date" value={editDue} onChange={e => setEditDue(e.target.value)} />
            </div>
            <select className="task-edit-cat" value={task.category || 'Other'}
              onChange={e => onUpdate(task.id, { category: e.target.value })}>
              {Object.keys(TASK_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea className="task-edit-note" placeholder="Notes (optional)"
            value={editNote} onChange={e => setEditNote(e.target.value)} rows={2} />
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
    <div className="task-row-wrapper">
      <div className={`task-row ${task.completed ? 'completed' : ''} ${level !== 'none' && level !== 'normal' && !task.completed ? `urgency-${level}` : ''}`}
        style={urgencyColor && !task.completed ? { borderLeft: `3px solid ${urgencyColor}` } : {}}>
        <button className={`task-checkbox ${task.completed ? 'checked' : ''}`} onClick={() => onToggle(task.id)}>
          {task.completed ? '✓' : ''}
        </button>
        <div className="task-body" onClick={() => !task.completed && !hasSubtasks && setEditing(true)}>
          <div className="task-title-row">
            <span className="task-title">{task.title}</span>
            <span className="task-cat-dot" style={{ background: catColor }} title={task.category} />
          </div>
          <div className="task-meta">
            {task.dueDate && !task.completed && <UrgencyBadge dueDate={task.dueDate} />}
            {task.dueDate && task.completed && <span className="task-date-quiet">Due {formatDate(task.dueDate)}</span>}
            {task.critical && !task.completed && <span className="critical-tag">CRITICAL</span>}
            {hasSubtasks && !task.completed && <span className="subtask-progress">{completedSubtasks}/{subtasks.length} steps</span>}
            {task.note && <span className="task-note-preview">{task.note}</span>}
          </div>
        </div>
        <div className="task-row-actions">
          {hasSubtasks && !task.completed && (
            <button className="subtask-toggle-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? '▲' : '▼'} Steps
            </button>
          )}
          {!task.completed && <button className="task-edit-btn" onClick={() => setEditing(true)}>✏️</button>}
        </div>
      </div>
      {hasSubtasks && expanded && (
        <div className="subtasks-list">
          {subtasks.map(s => (
            <div key={s.id} className={`subtask-row ${s.completed ? 'completed' : ''}`}>
              <button className={`subtask-checkbox ${s.completed ? 'checked' : ''}`} onClick={() => toggleSubtask(s.id)}>
                {s.completed ? '✓' : ''}
              </button>
              <span className="subtask-title">{s.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quick Add Task ───────────────────────────────────────────────────────────
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
    setTitle(''); setDueDate(''); setCategory('Other'); setCritical(false);
    inputRef.current?.focus();
  }

  if (!open) return (
    <button className="quick-add-trigger" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
      <span className="plus-icon">+</span> Add Task
    </button>
  );

  return (
    <div className="quick-add-panel">
      <input ref={inputRef} className="quick-add-input" placeholder="Task title... (Enter to add)"
        value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setOpen(false); }} autoFocus />
      <div className="quick-add-row2">
        <div className="quick-add-date-wrapper">
          <span className="quick-add-date-label">📅 Due Date</span>
          <input type="date" className="quick-add-date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <select className="quick-add-cat" value={category} onChange={e => setCategory(e.target.value)}>
          {Object.keys(TASK_CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label className="quick-add-critical">
          <input type="checkbox" checked={critical} onChange={e => setCritical(e.target.checked)} /> Critical
        </label>
      </div>
      <div className="quick-add-actions">
        <button className="btn-add-task" onClick={handleAdd}>Add Task</button>
        <button className="btn-cancel" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Case Detail View ─────────────────────────────────────────────────────────
function CaseDetail({ caseData, onUpdate, onBack, onDelete }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const pending = caseData.tasks.filter(t => !t.completed);
  const completed = caseData.tasks.filter(t => t.completed);
  const sortedPending = [...pending].sort((a, b) => {
    const da = daysFromNow(a.dueDate), db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });
  const focusNow = sortedPending.filter(t => {
    const days = daysFromNow(t.dueDate);
    return days !== null && (days <= 0 || (days <= 3 && t.critical));
  });
  const overdueCount = pending.filter(t => { const d = daysFromNow(t.dueDate); return d !== null && d < 0; }).length;
  const progress = caseData.tasks.length > 0 ? Math.round((completed.length / caseData.tasks.length) * 100) : 0;

  function toggleTask(id) {
    onUpdate({ tasks: caseData.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? todayISO() : null } : t) });
  }
  function deleteTask(id) { onUpdate({ tasks: caseData.tasks.filter(t => t.id !== id) }); }
  function updateTask(id, changes) { onUpdate({ tasks: caseData.tasks.map(t => t.id === id ? { ...t, ...changes } : t) }); }
  function addTask(taskData) {
    onUpdate({ tasks: [...caseData.tasks, { id: generateId(), ...taskData, completed: false, createdAt: todayISO() }] });
  }

  const typeLabel = caseData.type === 'prelitigation' ? 'Pre-Litigation' : 'Litigation';

  return (
    <div className="case-detail">
      <div className="case-detail-header">
        <button className="back-btn" onClick={onBack}>← All Cases</button>
        <div className="case-header-info">
          <div className="case-title-row">
            <h2 className="case-detail-title">{caseData.clientName}</h2>
            <span className={`case-type-badge ${caseData.type === 'prelitigation' ? 'badge-prelit' : 'badge-lit'}`}>{typeLabel}</span>
          </div>
          {caseData.caseNumber && <div className="case-number">#{caseData.caseNumber}</div>}
          {caseData.description && <div className="case-description">{caseData.description}</div>}
          <div className="case-opened">Opened {formatDate(caseData.openedDate)}</div>
        </div>
        <button className="btn-danger-sm" onClick={() => { if (window.confirm(`Delete case for ${caseData.clientName}?`)) onDelete(); }}>Delete Case</button>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Case Progress</span>
          <span className="progress-pct-lg">{progress}%</span>
          <span className="progress-counts">{completed.length} of {caseData.tasks.length} tasks done</span>
        </div>
        <div className="progress-bar-track lg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {focusNow.length > 0 && (
        <div className="focus-now-section">
          <div className="focus-now-header">
            <span className="focus-now-icon">🎯</span>
            <span className="focus-now-title">Focus Now</span>
            {overdueCount > 0 && <span className="overdue-count">{overdueCount} Overdue</span>}
          </div>
          <div className="focus-now-tasks">
            {focusNow.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />)}
          </div>
        </div>
      )}

      <div className="tasks-section">
        <div className="tasks-section-header">
          <h3>Pending Tasks <span className="task-count-badge">{pending.length}</span></h3>
        </div>
        <div className="tasks-list">
          {sortedPending.length === 0 && <div className="empty-tasks">🎉 All tasks complete!</div>}
          {sortedPending.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />)}
        </div>
        <QuickAddTask onAdd={addTask} />
      </div>

      {completed.length > 0 && (
        <div className="completed-section">
          <button className="toggle-completed" onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? '▼' : '▶'} Completed ({completed.length})
          </button>
          {showCompleted && (
            <div className="tasks-list completed-list">
              {completed.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── New Case Modal ───────────────────────────────────────────────────────────
function NewCaseModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [caseType, setCaseType] = useState(null);
  const [clientName, setClientName] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [description, setDescription] = useState('');
  const [openedDate, setOpenedDate] = useState(todayISO());

  function handleCreate() {
    if (!clientName.trim()) return;
    const templates = caseType === 'prelitigation' ? PRELITIGATION_TASKS : LITIGATION_TASKS;
    const tasks = templates.map(t => ({
      id: generateId(), title: t.title, category: t.category, critical: t.critical,
      dueDate: addDays(openedDate, t.defaultDaysFromOpen).toISOString().split('T')[0],
      completed: false, createdAt: todayISO(),
      subtasks: (t.subtasks || []).map(s => ({ id: generateId(), title: s.title, completed: false })),
    }));
    onCreate({ id: generateId(), type: caseType, clientName: clientName.trim(), caseNumber: caseNumber.trim(), description: description.trim(), openedDate, tasks, createdAt: todayISO() });
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>New Case</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {step === 1 && (
          <div>
            <p className="modal-subtitle">What type of case is this?</p>
            <div className="case-type-choices">
              <button className={`case-type-btn prelit ${caseType === 'prelitigation' ? 'selected' : ''}`}
                onClick={() => { setCaseType('prelitigation'); setStep(2); }}>
                <span className="case-type-icon">📋</span>
                <span className="case-type-name">Pre-Litigation</span>
                <span className="case-type-desc">{PRELITIGATION_TASKS.length} standard tasks auto-loaded</span>
              </button>
              <button className={`case-type-btn lit ${caseType === 'litigation' ? 'selected' : ''}`}
                onClick={() => { setCaseType('litigation'); setStep(2); }}>
                <span className="case-type-icon">⚖️</span>
                <span className="case-type-name">Litigation</span>
                <span className="case-type-desc">{LITIGATION_TASKS.length} tasks with subtasks auto-loaded</span>
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="modal-back-row">
              <button className="modal-back" onClick={() => setStep(1)}>← Change type</button>
              <span className={`case-type-badge ${caseType === 'prelitigation' ? 'badge-prelit' : 'badge-lit'}`}>
                {caseType === 'prelitigation' ? 'Pre-Litigation' : 'Litigation'}
              </span>
            </div>
            <div className="modal-field">
              <label>Client Name *</label>
              <input className="modal-input" placeholder="e.g. Jane Smith" value={clientName}
                onChange={e => setClientName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && clientName.trim() && handleCreate()} autoFocus />
            </div>
            <div className="modal-field">
              <label>Case / File Number</label>
              <input className="modal-input" placeholder="e.g. 2024-0123" value={caseNumber} onChange={e => setCaseNumber(e.target.value)} />
            </div>
            <div className="modal-field">
              <label>Brief Description</label>
              <input className="modal-input" placeholder="e.g. Slip and fall, grocery store" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="modal-field">
              <label>Date Opened</label>
              <input type="date" className="modal-input" value={openedDate} onChange={e => setOpenedDate(e.target.value)} />
            </div>
            <div className="modal-note">📌 Task due dates are calculated automatically from the open date.</div>
            <button className="btn-create-case" onClick={handleCreate} disabled={!clientName.trim()}>Create Case →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Alerts Panel ─────────────────────────────────────────────────────────────
function AlertsPanel({ cases }) {
  const urgent = [];
  cases.forEach(c => {
    c.tasks.filter(t => !t.completed).forEach(t => {
      const days = daysFromNow(t.dueDate);
      const level = getUrgencyLevel(days);
      if (level !== 'none' && level !== 'normal' && level !== 'soon') {
        urgent.push({ ...t, caseName: c.clientName, caseId: c.id, days });
      }
    });
  });
  urgent.sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
  if (urgent.length === 0) return null;
  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <span className="alerts-icon">🚨</span>
        <span className="alerts-title">Needs Attention Now</span>
        <span className="alerts-count">{urgent.length}</span>
      </div>
      <div className="alerts-list">
        {urgent.map(t => (
          <div key={t.id} className="alert-item">
            <div className="alert-case-name">{t.caseName}</div>
            <div className="alert-task-title">{t.title}</div>
            <UrgencyBadge dueDate={t.dueDate} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Upcoming Deadlines ───────────────────────────────────────────────────────
function UpcomingDeadlines({ cases, miscTasks, onSelectCase }) {
  const all = [];
  cases.forEach(c => {
    c.tasks.filter(t => !t.completed && t.dueDate).forEach(t => {
      all.push({ ...t, caseName: c.clientName, caseId: c.id, isMisc: false });
    });
  });
  (miscTasks || []).filter(t => !t.completed && t.dueDate).forEach(t => {
    all.push({ ...t, caseName: 'Misc', caseId: null, isMisc: true });
  });
  all.sort((a, b) => {
    const da = daysFromNow(a.dueDate), db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });
  const top25 = all.slice(0, 25);
  if (top25.length === 0) return null;
  return (
    <div className="deadlines-panel">
      <div className="deadlines-header">
        <span className="deadlines-icon">🗓</span>
        <span className="deadlines-title">Upcoming Deadlines</span>
        <span className="task-count-badge">{top25.length} of {all.length}</span>
      </div>
      <div className="deadlines-list">
        {top25.map(t => {
          const days = daysFromNow(t.dueDate);
          const level = getUrgencyLevel(days);
          const color = getUrgencyColor(level);
          return (
            <div key={t.id} className="deadline-item" style={color ? { borderLeftColor: color } : {}}
              onClick={() => t.caseId && onSelectCase(t.caseId)}>
              <div className="deadline-item-left">
                <div className="deadline-task-title">{t.title}</div>
                <div className="deadline-case-name">
                  {t.isMisc ? <span>📋 Misc</span> : `⚖️ ${t.caseName}`}
                  {t.critical && <span className="critical-tag" style={{ marginLeft: 6 }}>CRITICAL</span>}
                </div>
              </div>
              <div className="deadline-badge-col">
                <UrgencyBadge dueDate={t.dueDate} />
                {(level === 'none' || level === 'normal') && (
                  <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{formatDate(t.dueDate)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Misc Panel ───────────────────────────────────────────────────────────────
function MiscPanel({ tasks, onUpdate }) {
  const [showCompleted, setShowCompleted] = useState(false);
  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);
  const sorted = [...pending].sort((a, b) => {
    const da = daysFromNow(a.dueDate), db = daysFromNow(b.dueDate);
    if (da === null && db === null) return 0;
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });
  function toggleTask(id) { onUpdate(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); }
  function deleteTask(id) { onUpdate(tasks.filter(t => t.id !== id)); }
  function updateTask(id, changes) { onUpdate(tasks.map(t => t.id === id ? { ...t, ...changes } : t)); }
  function addTask(data) { onUpdate([...tasks, { id: generateId(), ...data, completed: false, createdAt: todayISO() }]); }
  if (tasks.length === 0) return null;
  return (
    <div className="misc-panel">
      <div className="misc-panel-header">
        <span className="misc-icon">📋</span>
        <span className="misc-title">Misc / Firm Tasks</span>
        <span className="task-count-badge">{pending.length} pending</span>
      </div>
      <div className="tasks-list">
        {sorted.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />)}
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
              {completed.map(t => <TaskRow key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Global Capture Modal ─────────────────────────────────────────────────────
function GlobalCaptureModal({ cases, onClose, onAddToCase, onAddToMisc }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [critical, setCritical] = useState(false);
  const [destination, setDestination] = useState('misc');
  const inputRef = useRef();
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80); }, []);

  function handleAdd() {
    if (!title.trim()) return;
    const task = { id: generateId(), title: title.trim(), dueDate: dueDate || null, critical, category: 'Other', completed: false, createdAt: todayISO() };
    destination === 'misc' ? onAddToMisc(task) : onAddToCase(destination, task);
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
          <input ref={inputRef} className="modal-input capture-input" placeholder="What needs to happen?"
            value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && title.trim() && handleAdd()} />
        </div>
        <div className="modal-field">
          <label>Due date (optional)</label>
          <input type="date" className="modal-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>
        <div className="modal-field">
          <label>Add to</label>
          <select className="modal-input" value={destination} onChange={e => setDestination(e.target.value)}>
            <option value="misc">📋 Misc / Firm Tasks</option>
            {cases.map(c => <option key={c.id} value={c.id}>⚖️ {c.clientName}{c.caseNumber ? ` (#${c.caseNumber})` : ''}</option>)}
          </select>
        </div>
        <label className="capture-critical-row">
          <input type="checkbox" checked={critical} onChange={e => setCritical(e.target.checked)} /> Mark as critical
        </label>
        <button className="btn-create-case" onClick={handleAdd} disabled={!title.trim()} style={{ marginTop: 16 }}>Add Task →</button>
      </div>
    </div>
  );
}

// ─── Floating Button ──────────────────────────────────────────────────────────
function FloatingCaptureButton({ onClick }) {
  return (
    <button className="floating-capture-btn" onClick={onClick} title="Quick capture">
      <span className="floating-plus">+</span>
    </button>
  );
}

// ─── Cases Table ──────────────────────────────────────────────────────────────
function CasesTable({ cases, onSelectCase, title }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('urgency');

  let filtered = cases.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.clientName.toLowerCase().includes(q) || c.caseNumber?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  if (sortBy === 'urgency') {
    filtered = filtered.sort((a, b) => {
      const getMin = c => {
        const days = c.tasks.filter(t => !t.completed).map(t => daysFromNow(t.dueDate)).filter(d => d !== null);
        return days.length > 0 ? Math.min(...days) : 999;
      };
      return getMin(a) - getMin(b);
    });
  } else if (sortBy === 'alpha') {
    filtered = filtered.sort((a, b) => a.clientName.localeCompare(b.clientName));
  } else if (sortBy === 'opened') {
    filtered = filtered.sort((a, b) => new Date(b.openedDate) - new Date(a.openedDate));
  }

  return (
    <div>
      <div className="list-controls">
        <input className="search-input" placeholder="🔍 Search cases..."
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="urgency">Sort: Most Urgent</option>
          <option value="alpha">Sort: A–Z</option>
          <option value="opened">Sort: Newest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h2>{cases.length === 0 ? 'No cases yet' : 'No matches'}</h2>
          <p>{cases.length === 0 ? 'Create your first case to get started.' : 'Try a different search.'}</p>
        </div>
      ) : (
        <div className="cases-table-wrapper">
          <div className="cases-table-header">
            <span className="cases-table-title">{title}</span>
            <span className="cases-table-count">{filtered.length} {filtered.length === 1 ? 'matter' : 'matters'}</span>
          </div>
          <table className="cases-table">
            <thead>
              <tr>
                <th>Case / Matter</th>
                <th>Type</th>
                <th>Next Deadline</th>
                <th>Progress</th>
                <th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const pending = c.tasks.filter(t => !t.completed);
                const completedTasks = c.tasks.filter(t => t.completed);
                const progress = c.tasks.length > 0 ? Math.round((completedTasks.length / c.tasks.length) * 100) : 0;
                const sortedPending = [...pending].sort((a, b) => {
                  const da = daysFromNow(a.dueDate), db = daysFromNow(b.dueDate);
                  if (da === null && db === null) return 0;
                  if (da === null) return 1; if (db === null) return -1;
                  return da - db;
                });
                const nextDue = sortedPending[0];
                const overdueCount = pending.filter(t => { const d = daysFromNow(t.dueDate); return d !== null && d < 0; }).length;
                const dueTodayCount = pending.filter(t => daysFromNow(t.dueDate) === 0).length;

                return (
                  <tr key={c.id} onClick={() => onSelectCase(c.id)}>
                    <td className="case-name-cell">
                      <div className="case-title">{c.clientName}</div>
                      {c.caseNumber && <div className="case-num">#{c.caseNumber}</div>}
                      {c.description && <div className="case-desc">{c.description}</div>}
                    </td>
                    <td>
                      <span className={`case-type-badge ${c.type === 'prelitigation' ? 'badge-prelit' : 'badge-lit'}`}>
                        {c.type === 'prelitigation' ? 'Pre-Lit' : 'Litigation'}
                      </span>
                    </td>
                    <td className="deadline-cell">
                      {overdueCount > 0 && <span className="alert-badge overdue-badge">🚨 {overdueCount} Overdue</span>}
                      {overdueCount === 0 && dueTodayCount > 0 && <span className="alert-badge today-badge">🔥 Due Today</span>}
                      {overdueCount === 0 && dueTodayCount === 0 && nextDue?.dueDate && <UrgencyBadge dueDate={nextDue.dueDate} />}
                      {!nextDue && <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>}
                    </td>
                    <td className="progress-cell">
                      <div className="progress-cell-inner">
                        <div className="progress-bar-track" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="progress-pct">{progress}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                      {formatDate(c.openedDate)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(INITIAL_STATE);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewCase, setShowNewCase] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCapture, setShowCapture] = useState(false);
  const [saved, setSaved] = useState(true);
  const fileInputRef = useRef();

  useEffect(() => {
    const loaded = loadData();
    if (loaded) setData({ miscTasks: [], ...loaded });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { saveData(data); setSaved(true); }, 500);
    return () => clearTimeout(timer);
  }, [data]);

  function updateData(newData) { setSaved(false); setData(newData); }
  function createCase(c) { updateData({ ...data, cases: [...data.cases, c] }); setShowNewCase(false); setSelectedCaseId(c.id); setActiveTab('dashboard'); }
  function updateCase(id, changes) { updateData({ ...data, cases: data.cases.map(c => c.id === id ? { ...c, ...changes } : c) }); }
  function deleteCase(id) { updateData({ ...data, cases: data.cases.filter(c => c.id !== id) }); setSelectedCaseId(null); }
  function addTaskToMisc(task) { updateData({ ...data, miscTasks: [...(data.miscTasks || []), task] }); }
  function addTaskToCase(caseId, task) { updateData({ ...data, cases: data.cases.map(c => c.id === caseId ? { ...c, tasks: [...c.tasks, task] } : c) }); }
  function updateMiscTasks(tasks) { updateData({ ...data, miscTasks: tasks }); }

  const selectedCase = data.cases.find(c => c.id === selectedCaseId);
  const totalOverdue = data.cases.reduce((sum, c) => sum + c.tasks.filter(t => !t.completed && daysFromNow(t.dueDate) !== null && daysFromNow(t.dueDate) < 0).length, 0);

  // Case detail view
  if (selectedCase) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-left">
            <div>
              <div className="app-logo-text">The <span className="cat">CAT-A-BASE</span></div>
              <div className="app-logo-subtitle">Cat's Litigation Dashboard</div>
            </div>
          </div>
          <div className="header-right">
            {!saved && <span className="saving-indicator">saving...</span>}
            {saved && <span className="saved-indicator">✓ saved</span>}
          </div>
        </header>
        <nav className="nav-bar">
          <button className="nav-tab" onClick={() => setSelectedCaseId(null)}>← Dashboard</button>
        </nav>
        <main className="app-main">
          <CaseDetail caseData={selectedCase} onUpdate={changes => updateCase(selectedCase.id, changes)}
            onBack={() => setSelectedCaseId(null)} onDelete={() => deleteCase(selectedCase.id)} />
        </main>
        <FloatingCaptureButton onClick={() => setShowCapture(true)} />
        {showCapture && <GlobalCaptureModal cases={data.cases} onClose={() => setShowCapture(false)} onAddToCase={addTaskToCase} onAddToMisc={addTaskToMisc} />}
      </div>
    );
  }

  return (
    <div className="app">
      {/* Top header */}
      <header className="app-header">
        <div className="header-left">
          <div>
            <div className="app-logo-text">The <span className="cat">CAT-A-BASE</span></div>
            <div className="app-logo-subtitle">Cat's Litigation Dashboard</div>
          </div>
          {totalOverdue > 0 && <span className="header-overdue-badge">{totalOverdue} Overdue</span>}
        </div>
        <div className="header-right">
          {!saved && <span className="saving-indicator">saving...</span>}
          {saved && <span className="saved-indicator">✓ saved</span>}
          <button className="btn-settings" onClick={() => setShowSettings(!showSettings)} title="Settings">⚙️</button>
          <button className="btn-new-case" onClick={() => setShowNewCase(true)}>+ New Case</button>
        </div>
      </header>

      {/* Black nav tabs */}
      <nav className="nav-bar">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'cases',     label: 'Cases' },
          { id: 'litigation',label: 'Litigation' },
          { id: 'prelit',    label: 'Pre-Lit' },
        ].map(tab => (
          <button key={tab.id} className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Settings bar */}
      {showSettings && (
        <div className="settings-bar">
          <div className="settings-content">
            <span className="settings-label">Data Backup:</span>
            <button className="btn-export" onClick={() => exportData(data)}>⬇ Export JSON</button>
            <button className="btn-import" onClick={() => fileInputRef.current.click()}>⬆ Import JSON</button>
            <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                importData(file, (err, imported) => {
                  if (err) { alert('Invalid file.'); return; }
                  if (window.confirm('Replace all current data with this backup?')) { updateData(imported); setShowSettings(false); }
                });
                e.target.value = '';
              }} />
            <span className="settings-tip">Export and store in Google Drive or Dropbox for cross-device access.</span>
          </div>
        </div>
      )}

      <main className="app-main">
        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && (
          <>
            <div className="dashboard-capture-bar">
              <button className="dashboard-capture-btn" onClick={() => setShowCapture(true)}>
                <span className="dashboard-capture-plus">+</span>
                <span>Quick capture a task...</span>
              </button>
            </div>
            <AlertsPanel cases={data.cases} />
            <UpcomingDeadlines cases={data.cases} miscTasks={data.miscTasks} onSelectCase={id => { setSelectedCaseId(id); }} />
            <MiscPanel tasks={data.miscTasks || []} onUpdate={updateMiscTasks} />
          </>
        )}

        {/* ── CASES TAB (all, alphabetical) ── */}
        {activeTab === 'cases' && (
          <CasesTable cases={data.cases} onSelectCase={setSelectedCaseId} title="All Cases" />
        )}

        {/* ── LITIGATION TAB ── */}
        {activeTab === 'litigation' && (
          <CasesTable cases={data.cases.filter(c => c.type === 'litigation')} onSelectCase={setSelectedCaseId} title="Litigation Cases" />
        )}

        {/* ── PRE-LIT TAB ── */}
        {activeTab === 'prelit' && (
          <CasesTable cases={data.cases.filter(c => c.type === 'prelitigation')} onSelectCase={setSelectedCaseId} title="Pre-Litigation Cases" />
        )}
      </main>

      <FloatingCaptureButton onClick={() => setShowCapture(true)} />
      {showNewCase && <NewCaseModal onClose={() => setShowNewCase(false)} onCreate={createCase} />}
      {showCapture && <GlobalCaptureModal cases={data.cases} onClose={() => setShowCapture(false)} onAddToCase={addTaskToCase} onAddToMisc={addTaskToMisc} />}
    </div>
  );
}
